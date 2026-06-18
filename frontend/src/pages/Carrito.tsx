import { useState, useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import ItemCarrito from "../components/ItemCarrito";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { crearEnvio } from "../api/enviosApi";


export default function CarritoPage() {
  const [tipoEntrega, setTipoEntrega] = useState("ENVIO");
  const [direccion, setDireccion] = useState("");
  const [departamento, setDepartamento] = useState("");
  const departamentos = [
    "La Paz",
    "Cochabamba",
    "Santa Cruz",
    "Oruro",
    "Potosí",
    "Chuquisaca",
    "Tarija",
    "Beni",
    "Pando",
  ];
  const [metodoPago, setMetodoPago] = useState("QR");
  const [venta, setVenta] = useState<any>(null);
  const { carrito, loading, cargarCarrito } = useCarrito();
  useEffect(() => {
    cargarCarrito();
  }, []);
  const navigate = useNavigate();
  const [procesando, setProcesando] = useState(false);

  if (loading && !carrito) {
    return (
      <div className="container mt-4">
        <p>Cargando carrito...</p>
      </div>
    );
  }

  const total =
    carrito?.detalles?.reduce(
      (acc: number, item: any) =>
        acc + Number(item.precio_unitario) * item.cantidad,
      0
    ) || 0;

  const finalizarCompra = async () => {
    try {
      setProcesando(true);

      if (!carrito || (carrito.detalles?.length ?? 0) === 0){
        alert("El carrito está vacío");
        return;
      }

      const res = await api.post("/ventas/checkout-online", {
        id_carrito: carrito.id_carrito,
        metodo_pago: metodoPago,
        descuento: 0,
      });

      setVenta(res.data);

      alert("Venta creada. Procede al pago.");

    } catch (error: any) {
      alert(error?.response?.data?.message || "Error al finalizar compra");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="container mt-4">

      <h2>Mi Carrito</h2>

      {!carrito ? (
        <p>No tienes carrito activo</p>
      ) : (
        <>
          <p>
            Estado:{" "}
            {carrito.estado === "ACTIVO" && "En proceso"}
            {carrito.estado === "CONVERTIDO" && "Compra realizada"}
            {carrito.estado === "CANCELADO" && "Cancelado"}
            {carrito.estado === "EXPIRADO" && "Expirado"}
          </p>

          <div>
            {carrito.detalles?.map((item: any) => (
              <ItemCarrito key={item.id_detalle} item={item} />
            ))}
          </div>

          <h4 className="mt-3">
            Total: Bs. {total.toFixed(2)}
          </h4>

          <div className="mt-3">

            <label className="form-label">
              Método de pago
            </label>

            <select
              className="form-select"
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
            >
              <option value="QR">QR</option>
              <option value="EFECTIVO">EFECTIVO</option>
              <option value="TRANSFERENCIA">TRANSFERENCIA</option>
              <option value="TARJETA">TARJETA</option>
            </select>

          </div>

          <div className="mt-3">

            <label>Tipo de entrega</label>

            <select
              className="form-select"
              value={tipoEntrega}
              onChange={(e) => setTipoEntrega(e.target.value)}
            >
              <option value="ENVIO">Envío a domicilio</option>
              <option value="RECOJO">Recojo en tienda</option>
            </select>

          </div>

          {tipoEntrega === "ENVIO" && (
            <div className="mt-3">

              <input
                className="form-control mb-2"
                placeholder="Dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />

              <div className="mt-3">

                <label className="form-label">
                  Departamento
                </label>

                <select
                  className="form-select"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                >
                  <option value="">
                    Seleccione un departamento
                  </option>

                  {departamentos.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}

                </select>

              </div>
            </div>
          )}

          <button
            className="btn btn-success mt-3"
            disabled={
              procesando ||
              carrito.estado !== "ACTIVO" ||
              (carrito.detalles?.length ?? 0) === 0
            }
            onClick={finalizarCompra}
          >
            {procesando ? "Procesando..." : "Finalizar compra"}
          </button>

          {venta && venta.estado !== "PAGADA" && (
            <div className="card mt-3 p-3">

              <h4>Pagar Venta #{venta.id_venta}</h4>

              <p>Total: Bs {venta.total}</p>

              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    console.log("ANTES");
                    await api.post("/pagos", {
                      id_venta: venta.id_venta,
                      metodo_pago: metodoPago,
                      monto: Number(venta.total),
                    });
                    console.log("DESPUES");

                    if (tipoEntrega === "ENVIO") {

                      await crearEnvio({
                        id_venta: venta.id_venta,
                        direccion_envio: direccion,
                        departamento,
                        tipo_entrega: "ENVIO",
                        costo_envio: 10,
                      });
                      console.log("DESPUES ENVIO");

                    } else {

                      await crearEnvio({
                        id_venta: venta.id_venta,
                        direccion_envio: "RECOJO EN TIENDA",
                        departamento,
                        tipo_entrega: "RECOJO",
                        costo_envio: 10,
                      });
                      console.log("DESPUES ENVIO");

                    }

                    alert("Pago realizado con éxito");

                    await cargarCarrito();

                    setVenta(null);

                    navigate("/dashboard", { replace: true });

                  } catch (err: any) {
                    alert("Error al pagar");
                  }
                }}
              >
                Confirmar Pago
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}