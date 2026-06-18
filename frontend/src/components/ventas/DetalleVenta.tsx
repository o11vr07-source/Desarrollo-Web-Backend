import { ItemVenta } from "../../interfaces/ventaOffline";

interface Props {
  items: ItemVenta[];
  setItems: React.Dispatch<
    React.SetStateAction<ItemVenta[]>
  >;
}

export default function DetalleVenta({
  items,
  setItems,
}: Props) {

  const cambiarCantidad = (
    index: number,
    cantidad: number
  ) => {

    const copia = [...items];

    if (cantidad < 1) {
      return;
    }

    if (
      cantidad >
      copia[index].stock
    ) {
      alert(
        `Solo hay ${copia[index].stock} unidades`
      );
      return;
    }

    copia[index].cantidad =
      cantidad;

    setItems(copia);
  };

  const eliminar = (
    index: number
  ) => {

    const copia = [...items];

    copia.splice(index, 1);

    setItems(copia);
  };

  const total = items.reduce(
    (acc, item) =>
      acc +
      item.cantidad *
      item.precio_unitario,
    0
  );

  return (
    <div className="card">

      <div className="card-body">

        <h5 className="card-title">
          Detalle Venta
        </h5>

        <table className="table table-striped">

          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {items.map(
              (item, index) => (
                <tr
                  key={index}
                >
                  <td>
                    {item.producto}
                    <br />
                    <small>
                      {item.color}
                      {" - "}
                      {item.talla}
                    </small>
                  </td>

                  <td>

                    <input
                      type="number"
                      min={1}
                      max={
                        item.stock
                      }
                      className="form-control"
                      value={
                        item.cantidad
                      }
                      onChange={(
                        e
                      ) =>
                        cambiarCantidad(
                          index,
                          Number(
                            e.target
                              .value
                          )
                        )
                      }
                    />

                  </td>

                  <td>
                    Bs.
                    {" "}
                    {item.precio_unitario}
                  </td>

                  <td>
                    Bs.
                    {" "}
                    {(
                      item.cantidad *
                      item.precio_unitario
                    ).toFixed(
                      2
                    )}
                  </td>

                  <td>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        eliminar(
                          index
                        )
                      }
                    >
                      X
                    </button>

                  </td>
                </tr>
              )
            )}

          </tbody>

        </table>

        <h4 className="text-end">
          Total:
          {" "}
          Bs.
          {" "}
          {total.toFixed(2)}
        </h4>

      </div>

    </div>
  );
}