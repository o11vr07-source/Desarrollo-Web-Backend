import {
  actualizarCantidad,
  eliminarDetalle,
} from "../api/carritoApi";

import { useCarrito } from "../context/CarritoContext";

interface Props {
  item: any;
}

export default function ItemCarrito({ item }: Props) {

  const { cargarCarrito } = useCarrito();

  const aumentar = async () => {
    try {
  
      await actualizarCantidad(
        item.id_detalle,
        item.cantidad + 1
      );
  
      await cargarCarrito();
  
    } catch (error: any) {
  
      alert(
        error?.response?.data?.message ||
        "No fue posible actualizar la cantidad"
      );
  
    }
  };

  const disminuir = async () => {
    try {
  
      await actualizarCantidad(
        item.id_detalle,
        item.cantidad - 1
      );
  
      await cargarCarrito();
  
    } catch (error: any) {
  
      alert(
        error?.response?.data?.message ||
        "No fue posible actualizar la cantidad"
      );
  
    }
  };

  const eliminar = async () => {

    if (
      !confirm(
        "¿Eliminar este producto del carrito?"
      )
    ) {
      return;
    }

    await eliminarDetalle(
      item.id_detalle
    );

    await cargarCarrito();
  };

  const subtotal =
    Number(item.precio_unitario) *
    item.cantidad;
  return (
    <div className="card mb-3">
      <div className="row g-0">

        <div className="col-md-2">
          <img
            src={`http://localhost:3000${item.variante.producto.imagen_principal}`}
            alt={item.variante.producto.nombre}
            className="img-fluid rounded-start"
          />
        </div>

        <div className="col-md-10">
          <div className="card-body">

            <h5 className="card-title">
              {item.variante.producto.nombre}
            </h5>

            <p className="mb-1">
              <strong>Color:</strong>{" "}
              {item.variante.color.nombre}
            </p>

            <p className="mb-1">
              <strong>Talla:</strong>{" "}
              {item.variante.talla.nombre}
            </p>

            <p className="mb-1">
              <strong>SKU:</strong>{" "}
              {item.variante.sku}
            </p>

            <p className="mb-1">
              <strong>Stock:</strong>{" "}
              {item.variante.stock}
            </p>

            <p className="mb-1">
              <strong>Cantidad:</strong>{" "}
              {item.cantidad}
            </p>

            <p className="mb-1">
              <strong>Precio:</strong> Bs.{" "}
              {Number(item.precio_unitario).toFixed(2)}
            </p>
            <div className="d-flex align-items-center gap-2">

              <button
                className="btn btn-outline-secondary"
                onClick={disminuir}
              >
                -
              </button>

              <span>
                {item.cantidad}
              </span>

              <button
                className="btn btn-outline-secondary"
                onClick={aumentar}
              >
                +
              </button>

              <button
                className="btn btn-danger ms-3"
                onClick={eliminar}
              >
                Eliminar
              </button>

            </div>

            <h6 className="mt-3">
              Subtotal:
              {" "}
              Bs.
              {" "}
              {subtotal.toFixed(2)}
            </h6>
          </div>
        </div>

      </div>
    </div>
  );
}