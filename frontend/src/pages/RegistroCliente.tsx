import { useState } from "react";
import { AuthService } from "../services/auth.service";
import { ClientFlow } from "../services/clientFlow";
import { evaluarPassword } from "../utilis/passwordStrength";
import { Link } from "react-router-dom";

export default function RegistroCliente() {

  const cliente = ClientFlow.getClienteVerificado();
  const departamentosBolivia = [
    "La Paz",
    "Santa Cruz",
    "Cochabamba",
    "Oruro",
    "Potosí",
    "Chuquisaca",
    "Tarija",
    "Beni",
    "Pando",
  ];

  const [form, setForm] = useState({
    ci: cliente?.ci || "",
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    fecha_nac: "",
    email: "",
    username: "",
    password: "",
  });

  const nivelPassword =
    form.password?.length > 0
      ? evaluarPassword(form.password)
      : null;

  const registrar = async () => {
    await AuthService.registerCliente(form);

    ClientFlow.clear();

    alert("Registro exitoso");

    window.location.href = "/login";
  };

  return (
    <div className="container mt-3">
      <h2>Registro de Cliente</h2>

      <input
        value={form.ci}
        disabled
        className="form-control mb-2"
        placeholder="CI"
      />
      <input
        className="form-control mb-2"
        placeholder="Nombres"
        onChange={(e) =>
          setForm({ ...form, nombres: e.target.value })
        }
      />

      <input
        className="form-control mb-2"
        placeholder="Apellidos"
        onChange={(e) =>
          setForm({ ...form, apellidos: e.target.value })
        }
      />

      <input
        className="form-control mb-2"
        placeholder="Teléfono"
        onChange={(e) =>
          setForm({ ...form, telefono: e.target.value })
        }
      />

      <input
        className="form-control mb-2"
        placeholder="Dirección"
        onChange={(e) =>
          setForm({ ...form, direccion: e.target.value })
        }
      />

      <select
        className="form-select mb-2"
        value={form.ciudad}
        onChange={(e) =>
          setForm({ ...form, ciudad: e.target.value })
        }
      >
        <option value="">Seleccione departamento</option>

        {departamentosBolivia.map((dep) => (
          <option key={dep} value={dep}>
            {dep}
          </option>
        ))}
      </select>
      <label className="form-label">
        Fecha de nacimiento
      </label>
      <input
        className="form-control mb-2"
        type="date"
        onChange={(e) =>
          setForm({ ...form, fecha_nac: e.target.value })
        }
      />

      <input
        className="form-control mb-2"
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />
      <input
        className="form-control mb-2"
        placeholder="Username"
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />
      <div className="input-group">
      <input
        className="form-control mb-2"
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />
      </div>
      
      <div className="container">
      {form.password?.length > 0 && nivelPassword && (
        <small>
          {nivelPassword === "DEBIL" && (
            <span style={{ color: "red" }}>🔴 Débil</span>
          )}

          {nivelPassword === "MEDIA" && (
            <span style={{ color: "orange" }}>🟡 Media</span>
          )}

          {nivelPassword === "FUERTE" && (
            <span style={{ color: "green" }}>🟢 Fuerte</span>
          )}
        </small>
      )} 
      </div>
       
      <button className="btn btn-success mt-2 me-2" onClick={registrar}>
        Crear cuenta
      </button>
      <Link to="/home"><button className="btn btn-danger mt-2">
        Volver al Inicio
      </button>
      </Link>

    </div>

  );
}