interface Props {
    clientes: any[];
    clienteSeleccionado: string;
    setClienteSeleccionado: (
      value: string
    ) => void;
  }
  
  export default function SelectorCliente({
    clientes,
    clienteSeleccionado,
    setClienteSeleccionado,
  }: Props) {
    return (
      <div className="card mb-3">
        <div className="card-body">
  
          <h5 className="card-title">
            Cliente
          </h5>
  
          <select
            className="form-select"
            value={clienteSeleccionado}
            onChange={(e) =>
              setClienteSeleccionado(
                e.target.value
              )
            }
          >
            <option value="">
              Seleccionar cliente
            </option>
  
            {clientes.map((c) => (
              <option
                key={c.id_cliente}
                value={c.id_cliente}
              >
                {c.persona.nombres}
                {" "}
                {c.persona.apellidos}
              </option>
            ))}
          </select>
  
        </div>
      </div>
    );
  }