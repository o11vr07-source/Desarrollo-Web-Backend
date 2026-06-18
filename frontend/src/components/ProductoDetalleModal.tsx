import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import {
  obtenerDetalleProducto,
} from "../services/catalogo.service";
import {
  agregarAlCarrito,
  obtenerCarritoActivo,
} from "../services/carrito.service";

import { useCarrito } from "../context/CarritoContext";

interface Props {
  productoId: number | null;
}

export default function ProductoDetalleModal({ productoId }: Props) {
  const { cargarCarrito } = useCarrito();

  const [producto, setProducto] = useState<any>(null);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<any>(null);
  const [cantidad, setCantidad] = useState(1);

  const abrirModal = () => {
    const el = document.getElementById("modalProducto");
    const modal = new Modal(el!);
    modal.show();
  };

  const cerrarModal = () => {
    const el = document.getElementById("modalProducto");
    const modal = Modal.getInstance(el!);
    modal?.hide();
  };

  useEffect(() => {
    if (productoId) {
      cargarProducto();
    }
  }, [productoId]);

  const cargarProducto = async () => {
    try {
      const data = await obtenerDetalleProducto(productoId!);

      setProducto(data);
      setVarianteSeleccionada(null);
      setCantidad(1);

      abrirModal();
    } catch (error) {
      console.error("Error al cargar producto:", error);
    }
  };


  const precioFinal = () => {
    if (!producto || !varianteSeleccionada) return 0;

    return (
      Number(producto.precio) +
      Number(varianteSeleccionada.precio_extra)
    );
  };


  const agregarAlCarritoHandler = async () => {
    try {
      const carrito = await obtenerCarritoActivo();

      await agregarAlCarrito({
        id_carrito: carrito.id_carrito,
        id_variante: varianteSeleccionada.id_variante,
        cantidad,
        precio_unitario: precioFinal(),
      });
      
      await cargarCarrito(); 
      
      alert("Producto agregado al carrito");

      cerrarModal();

    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  return (
    <div
      className="modal fade"
      id="modalProducto"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">
              {producto?.nombre || "Producto"}
            </h5>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>

          <div className="modal-body">

            {!producto ? (
              <p>Cargando producto...</p>
            ) : (
              <>
                <p>
                  <strong>Precio base:</strong>{" "}
                  Bs. {producto.precio}
                </p>

                <hr />

                <h6>Variantes</h6>

                <div className="list-group mb-3">

                  {producto.variantes?.map((v: any) => (
                    <button
                      key={v.id_variante}
                      className={`list-group-item list-group-item-action ${
                        varianteSeleccionada?.id_variante ===
                        v.id_variante
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setVarianteSeleccionada(v)
                      }
                    >
                      {v.color.nombre} - {v.talla.nombre}
                      {" "} | Stock: {v.stock}
                    </button>
                  ))}

                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Cantidad
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    min={1}
                    max={
                      varianteSeleccionada?.stock || 1
                    }
                    value={cantidad}
                    disabled={!varianteSeleccionada}
                    onChange={(e) =>
                      setCantidad(Number(e.target.value))
                    }
                  />
                </div>

                <h5>
                  Precio final: Bs. {precioFinal()}
                </h5>
              </>
            )}

          </div>

          <div className="modal-footer">

            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>

            <button
              type="button"
              className="btn btn-primary"
              disabled={!varianteSeleccionada}
              onClick={agregarAlCarritoHandler}
            >
              Agregar al carrito
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}