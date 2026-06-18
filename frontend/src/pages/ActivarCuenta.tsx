import { useState } from "react";
import { AuthService } from "../services/auth.service";
import { ClientFlow } from "../services/clientFlow";
import { evaluarPassword } from "../utilis/passwordStrength";

export default function ActivarCuenta() {

  const data = ClientFlow.getClienteVerificado();

  if (!data?.cliente?.id_persona) {
    return (
      <div className="container mt-4">
        <h3>Error</h3>
        <p>No se pudo cargar la información del cliente.</p>
        <p>Vuelve a verificar tu CI</p>
      </div>
    );
  }

  const [form, setForm] = useState({
    id_persona: data?.cliente?.id_persona || "",
    username: "",
    password: "",
  });

  const nivelPassword =
    form.password?.length > 0
      ? evaluarPassword(form.password)
      : null;

      const activar = async () => {
        if (!form.username.trim() || !form.password.trim() || !form.id_persona) {
          alert("Completa todos los campos");
          return;
        }
      
        try {
          console.log("FORM ACTIVAR:", form);
          await AuthService.activarCuenta({
            id_persona: Number(form.id_persona),
            username: form.username.trim(),
            password: form.password,
          });
      
          ClientFlow.clear();
      
          alert("Cuenta activada");
      
          window.location.href = "/login";
        } catch (error: any) {
          alert(error?.response?.data?.message || "Error al activar cuenta");
        }
      };

  return (
    <div className="container">
      <h2>Activar Cuenta</h2>

      <input
        className="form-control mb-2"
        placeholder="Username"
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />

      <input
        className="form-control mb-2"
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />
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

      <button className="btn btn-primary" onClick={activar}>
        Activar cuenta
      </button>
    </div>
  );
}