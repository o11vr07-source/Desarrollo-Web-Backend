import { useEffect, useState } from "react";

import SelectorCliente from "../components/ventas/SelectorCliente";
import ListaProductosVenta from "../components/ventas/ListaProductosVenta";
import DetalleVenta from "../components/ventas/DetalleVenta";

import { ItemVenta } from "../interfaces/ventaOffline";

import { getClientes } from "../api/clientesApi";
import { getVariantes } from "../api/variantesApi";
import { checkoutOffline } from "../api/ventasApi";

import { useAuth } from "../auth/AuthContext";
import { crearPago } from "../api/pagosApi";

export default function VentasOffline() {

  const { user } = useAuth();

  const [loading, setLoading] =
    useState(true);

  const [procesando, setProcesando] =
    useState(false);

  const [clientes, setClientes] =
    useState<any[]>([]);

  const [variantes, setVariantes] =
    useState<any[]>([]);

  const [clienteSeleccionado,
    setClienteSeleccionado] =
    useState("");

  const [metodoPago,
    setMetodoPago] =
    useState("EFECTIVO");

  const [items,
    setItems] =
    useState<ItemVenta[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {

    try {

      const [
        clientesData,
        variantesData,
      ] = await Promise.all([
        getClientes(),
        getVariantes(),
      ]);

      setClientes(clientesData.filter(
        (c: any) => c.estado === "ACTIVO"
      ));

      setVariantes(
        variantesData.filter(
          (v: any) =>
            v.estado === "ACTIVADO" &&
            v.stock > 0
        )
      );

    } catch (error) {

      console.error(error);

      alert(
        "Error cargando datos"
      );

    } finally {

      setLoading(false);

    }
  };

  const agregarProducto =
    (variante: any) => {

      const precio =
        Number(
          variante.producto.precio
        ) +
        Number(
          variante.precio_extra
        );

      const existente =
        items.find(
          (item) =>
            item.id_variante ===
            variante.id_variante
        );

      if (existente) {

        if (
          existente.cantidad + 1 >
          existente.stock
        ) {
          alert(
            `Solo hay ${existente.stock} unidades disponibles`
          );
          return;
        }

        setItems(
          items.map((item) =>
            item.id_variante ===
            variante.id_variante
              ? {
                  ...item,
                  cantidad:
                    item.cantidad + 1,
                }
              : item
          )
        );

        return;
      }

      const nuevoItem: ItemVenta = {
        id_variante:
          variante.id_variante,

        producto:
          variante.producto.nombre,

        color:
          variante.color.nombre,

        talla:
          variante.talla.nombre,

        stock:
          variante.stock,

        cantidad: 1,

        precio_unitario:
          precio,
      };

      setItems([
        ...items,
        nuevoItem,
      ]);
    };

  const finalizarVenta =
    async () => {

      try {

        if (
          !clienteSeleccionado
        ) {
          alert(
            "Seleccione un cliente"
          );
          return;
        }

        if (
          items.length === 0
        ) {
          alert(
            "Agregue productos"
          );
          return;
        }

        setProcesando(true);

        await checkoutOffline({
          id_cliente:
            Number(
              clienteSeleccionado
            ),

          id_usuario:
            user?.id,

          metodo_pago:
            metodoPago,

          productos:
            items.map(
              (item) => ({
                id_variante:
                  item.id_variante,

                cantidad:
                  item.cantidad,

                precio_unitario:
                  item.precio_unitario,
              })
            ),
        });

        const ventaCreada = await checkoutOffline({
          id_cliente: Number(clienteSeleccionado),
          id_usuario: user?.id,
          metodo_pago: metodoPago,
          productos: items.map((item) => ({
            id_variante: item.id_variante,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
          })),
        });

        await crearPago({
          id_venta: ventaCreada.id_venta,
          metodo_pago: metodoPago,
          monto: Number(ventaCreada.total),
        });

        alert(
          "Venta registrada correctamente"
        );

        setItems([]);

        setClienteSeleccionado("");

        setMetodoPago(
          "EFECTIVO"
        );

        await cargarDatos();

      } catch (error: any) {

        alert(
          error?.response?.data
            ?.message ||
          "Error al registrar venta"
        );

      } finally {

        setProcesando(false);

      }
    };

  if (loading) {
    return (
      <div className="container mt-4">
        Cargando...
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">

      <h2 className="mb-4">
        Venta Offline
      </h2>

      <div className="row">
        <div className="col-md-3">

          <SelectorCliente
            clientes={clientes}
            clienteSeleccionado={
              clienteSeleccionado
            }
            setClienteSeleccionado={
              setClienteSeleccionado
            }
          />

          <div className="card">

            <div className="card-body">

              <h5>
                Método de Pago
              </h5>

              <select
                className="form-select"
                value={
                  metodoPago
                }
                onChange={(e) =>
                  setMetodoPago(
                    e.target
                      .value
                  )
                }
              >
                <option value="EFECTIVO">
                  EFECTIVO
                </option>

                <option value="QR">
                  QR
                </option>

                <option value="TRANSFERENCIA">
                  TRANSFERENCIA
                </option>

                <option value="TARJETA">
                  TARJETA
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="col-md-4">

          <ListaProductosVenta
            variantes={
              variantes
            }
            onAgregar={
              agregarProducto
            }
          />

        </div>
        <div className="col-md-5">

          <DetalleVenta
            items={items}
            setItems={
              setItems
            }
          />

          <div className="d-grid mt-3">

            <button
              className="btn btn-success btn-lg"
              disabled={
                procesando
              }
              onClick={
                finalizarVenta
              }
            >
              {procesando
                ? "Procesando..."
                : "Finalizar Venta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}