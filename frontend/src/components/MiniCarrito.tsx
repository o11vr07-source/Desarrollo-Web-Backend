import { useCarrito } from "../context/CarritoContext";

export default function MiniCarrito() {

  const { carrito } = useCarrito();

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex={-1}
      id="miniCarrito"
    >
      <div className="offcanvas-header">
        <h5>Mi Carrito</h5>

        <button
          className="btn-close"
          data-bs-dismiss="offcanvas"
        />
      </div>

      <div className="offcanvas-body">

        {!carrito?.detalles?.length ? (
          <p>Carrito vacío</p>
        ) : (
          carrito.detalles.map((item: any) => (
            <div key={item.id_detalle} className="border-bottom mb-2 pb-2">
              <strong>{item.variante.producto.nombre}</strong>
              <div>
                {item.cantidad} x Bs. {item.precio_unitario}
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}