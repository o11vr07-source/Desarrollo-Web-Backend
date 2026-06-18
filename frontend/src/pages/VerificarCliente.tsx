import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";
import { ClientFlow } from "../services/clientFlow";

export default function VerificarCliente() {

  const [ci, setCi] = useState("");
  const [loading] = useState(false);
  const navigate = useNavigate();

  const verificar = async () => {
    const res = await AuthService.verificarCliente(ci);

    const data = res.data;

    ClientFlow.setClienteVerificado(data);

    console.log("DATA", data);

    if (!data.existe) {
      navigate("/registro-cliente");
      return;
    }

    if (data.existe && !data.tieneUsuario) {
      navigate("/activar-cuenta");
      return;
    }

    navigate("/login");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0d6efd, #6f42c1)",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: "420px",
          borderRadius: "15px",
        }}
      >
        <div className="card-body">
          <div className="text-center mb-3">
            <h2>Verificar Cliente</h2>
            <small className="text-muted">
              Sistema de Ventas e Inventario
            </small>
          </div>

          <h2 className="text-center mb-4">
            Ingrese su CI
          </h2>
          <div className="mb-3">
            <label className="form-label">
              Contraseña
            </label>

            <div className="input-group">

              <input
                className="form-control"
                placeholder="Ingrese CI"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
              />
            </div>
          </div>
          <button
            className="btn btn-primary w-100"
            onClick={verificar}
            disabled={loading}
          >
            {loading ? "Verificando..." : "Continuar"}
          </button>
          <Link to="/home"><button className="btn btn-danger w-100">
            Volver al Inicio
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}