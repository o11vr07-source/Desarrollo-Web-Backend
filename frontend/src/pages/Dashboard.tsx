import { useAuth } from "../auth/AuthContext";
import GraficoVentasMes from "../components/GraficoVentasMes";
import GraficoProductosVendidos from "../components/GraficoProductosVendidos";
import GraficoStock from "../components/GraficoStock";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container mt-4">

      <div className="card shadow-sm">
        <div className="card-body">

          <h2 className="mb-3">
            Bienvenido al Sistema
          </h2>
          <hr />
          <p>
            <strong>Usuario:</strong>{" "}
            {user?.username}
          </p>

          <p>
            <strong>Rol:</strong>{" "}
            {user?.rol}
          </p>
        </div>
      </div>

      <div className="row mt-4">
      {user?.rol !== "CLIENTE" &&(
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5>Gestione Clientes</h5>
              <h3><Link
          to="/clientes"
          className="btn btn-primary btn-lg mt-3"
        >
          Ir a Clientes
        </Link></h3>
            </div>
          </div>
        </div>)}

        {user?.rol !== "CLIENTE" &&(
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5>Administre Productos</h5>
              <h3><Link
          to="/productos"
          className="btn btn-primary btn-lg mt-3"
        >
          Ir a Productos
        </Link></h3>
            </div>
          </div>
        </div>)}

        {user?.rol === "ADMINISTRADOR" &&(
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5>Revisar Ventas</h5>
              <h3><Link
          to="/ventas"
          className="btn btn-primary btn-lg mt-3"
        >
          Ir a Ventas
        </Link></h3>
            </div>
          </div>
        </div>)}

        {user?.rol === "ADMINISTRADOR" &&(
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5>Revise Inventario</h5>
              <h3><Link
          to="/movimientosInventario"
          className="btn btn-primary btn-lg mt-3"
        >
          Ir al Inventario
        </Link></h3>
            </div>
          </div>
        </div>)}

        {user?.rol === "CLIENTE" &&(
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5>Catalogo de Productos</h5>
              <h3><Link
          to="/catalogo"
          className="btn btn-primary btn-lg mt-3"
        >
          Ir al Catalogo
        </Link></h3>
            </div>
          </div>
        </div>)}

      </div>
      
      <div className="row mt-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="mb-3">
              GRAFICOS ESTADISTICOS
            </h2>
            {user?.rol === "ADMINISTRADOR" && (
              <GraficoVentasMes />
            )}
            {user?.rol === "ADMINISTRADOR" && (
              <GraficoProductosVendidos />
            )}
            {user?.rol !== "CLIENTE" && (
              <GraficoStock />
            )}
            {user?.rol === "CLIENTE" && (
              <GraficoProductosVendidos />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}