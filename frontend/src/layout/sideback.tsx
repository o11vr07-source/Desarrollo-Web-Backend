import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div
      className="bg-light border-end p-3"
      style={{
        width: "280px",
        minHeight: "100vh",
      }}
    >
      <h5 className="mb-3">
        Menú
      </h5>

      <div className="d-flex flex-column gap-2">

        <Link to="/dashboard">
          Dashboard
        </Link>
        <Link to="/carrito">
          Carrito
        </Link>
        <Link to="/catalogo">
          Catalogo de Productos
        </Link>

        {user?.rol === "ADMINISTRADOR" && (
          <>
            <Link to="/ventas">
              Lista de Ventas
            </Link>

            <Link to="/usuarios">
              Usuarios
            </Link>

            <Link to="/roles">
              Roles
            </Link>

            <Link to="/empleados">
              Empleados
            </Link>

            <Link to="/sucursales">
              Sucursales
            </Link>
            
            <Link to="/marcas">
              Marcas
            </Link>

            <Link to="/equipos">
              Equipos
            </Link>

            <Link to="/colores">
              Colores
            </Link>

            <Link to="/tallas">
              Tallas
            </Link>

            <Link to="/variantes">
              Variantes
            </Link>

            <Link to="/logs">
              Logs de Accesos
            </Link>

            <Link to="/movimientosInventario">
              Inventario
            </Link>

            <Link to="/pagos">
              Lista de Pagos
            </Link>
          </>
        )}


        {(user?.rol === "ADMINISTRADOR" ||
          user?.rol === "VENDEDOR") && (
          <>
            <Link to="/clientes">
              Clientes
            </Link>

            <Link to="/productos">
              Productos
            </Link>

            <Link to="/categorias">
              Categorías
            </Link>

            <Link to="/ventaOffline">
              Ventas
            </Link>

            <Link to="/envios">
              Lista de Envios
            </Link>
          </>
        )}

      </div>
    </div>
  );
}