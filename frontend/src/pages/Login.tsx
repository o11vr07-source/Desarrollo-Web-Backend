import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Debe ingresar usuario y contraseña");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        username,
        password,
      });

      login(res.data);

      navigate("/dashboard");
    } catch (err: any) {
      const mensaje =
        err?.response?.data?.message ||
        "Usuario o contraseña incorrectos";

      setError(mensaje);
    } finally {
      setLoading(false);
    }
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

            <h1 className="fw-bold">
              Tienda Deportiva
            </h1>

            <small className="text-muted">
              Sistema de Ventas e Inventario
            </small>

          </div>

          <h2 className="text-center mb-4">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">
              Usuario
            </label>

            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Contraseña
            </label>

            <div className="input-group">

              <input
                type={mostrarPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  setMostrarPassword(!mostrarPassword)
                }
              >
                {mostrarPassword ? "Ocultar" : "Ver"}
              </button>

            </div>
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading
              ? "Ingresando..."
              : "Ingresar"}
          </button>
          <Link to="/home"><button className="btn btn-danger w-100">
            Volver al Inicio
          </button>        
          </Link>
          
          <div className="mt-3 text-center">
            <p>
              ¿No tienes cuenta?{" "}
              <Link to="/verificar-cliente">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}