import { useCarrito } from "../context/CarritoContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {

  const { carrito, cargarCarrito } = useCarrito();
  const navigate = useNavigate();

  const total = carrito?.detalles?.reduce(
    (acc: number, item: any) =>
      acc + Number(item.precio_unitario) * item.cantidad,
    0
  );

  const confirmarCompra = async () => {

    try {
      await api.patch(`/carritos/${carrito.id_carrito}/checkout`);

      await cargarCarrito();

      alert("Compra realizada con éxito");

      navigate("/carrito");

    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
        "Error al procesar compra"
      );
    }
  };

  if (!carrito) {
    return <p>No hay carrito activo</p>;
  }

  return (
    <div className="container mt-4">

      <h2>Checkout</h2>

      <div className="card p-3">

        <h5>Resumen</h5>

        {carrito.detalles?.map((item: any) => (
          <div key={item.id_detalle} className="d-flex justify-content-between">
            <span>
              {item.variante.producto.nombre} x {item.cantidad}
            </span>
            <span>
              Bs. {(item.precio_unitario * item.cantidad).toFixed(2)}
            </span>
          </div>
        ))}

        <hr />

        <h4>Total: Bs. {total?.toFixed(2)}</h4>

        <button
          className="btn btn-success w-100 mt-3"
          onClick={confirmarCompra}
        >
          Confirmar compra
        </button>

      </div>
    </div>
  );
}