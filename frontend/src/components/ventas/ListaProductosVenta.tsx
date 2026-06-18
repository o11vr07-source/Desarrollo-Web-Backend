import { useMemo, useState } from "react";

interface Props {
  variantes: any[];
  onAgregar: (variante: any) => void;
}

export default function ListaProductosVenta({
  variantes,
  onAgregar,
}: Props) {

  const [busqueda, setBusqueda] =
    useState("");

  const filtrados = useMemo(() => {

    return variantes.filter(
      (v) =>
        v.producto.descripcion
          .toLowerCase()
          .includes(
            busqueda.toLowerCase()
          )
    );

  }, [busqueda, variantes]);

  return (
    <div className="card mb-3">

      <div className="card-body">

        <h5 className="card-title">
          Productos
        </h5>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(
              e.target.value
            )
          }
        />

        <div
          style={{
            maxHeight: "350px",
            overflowY: "auto",
          }}
        >

          {filtrados.map((v) => {

            const precio =
              Number(
                v.producto.precio
              ) +
              Number(
                v.precio_extra
              );

            return (
              <div
                key={v.id_variante}
                className="border rounded p-2 mb-2"
              >

                <strong>
                  {v.producto.descripcion}
                </strong>
                <img
                  src={`http://localhost:3000${v.producto.imagen_principal}`}
                  className="card-img-top"
                  alt={v.producto.nombre}
                />
                <br />

                {v.color.nombre}
                {" - "}
                {v.talla.nombre}

                <br />

                Stock:
                {" "}
                {v.stock}

                <br />

                Precio:
                {" "}
                Bs.
                {" "}
                {precio}

                <br />

                <button
                  className="btn btn-primary btn-sm mt-2"
                  onClick={() =>
                    onAgregar(v)
                  }
                >
                  Agregar
                </button>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}