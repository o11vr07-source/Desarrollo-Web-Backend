import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div
      className="bg-dark text-white border-end p-3"
      style={{
        width: "250px",
        minHeight: "100vh",
      }}>
      <h5 className="mb-3">
        Menú
      </h5>
      <div className="d-flex flex-column gap-2">

        <Link to="/dashboard" className="btn text-white">
          INICIO
        </Link>
        <div className="accordion" id="sidebarAccordion">

          <div className="accordion-item bg-dark text-white border-0">

            <h2 className="accordion-header">

              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#tiendaOnline"
              >
                 TIENDA ONLINE
              </button>

            </h2>

            <div id="tiendaOnline"
              className="accordion-collapse collapse"
              data-bs-parent="#sidebarAccordion"
            >
              <div className="accordion-body d-flex flex-column gap-2 bg-dark">

                <Link to="/catalogo" className="btn text-white">
                  Catálogo
                </Link>

                <Link to="/carrito" className="btn text-white">
                  Carrito
                </Link>

              </div>
            </div>

          </div>
          {(user?.rol === "ADMINISTRADOR" ||
            user?.rol === "VENDEDOR") && (

              <div className="accordion-item bg-dark text-white border-0">

                <h2 className="accordion-header">

                <button
                className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#ventasMenu"
                  >
                     VENTAS
                  </button>

                </h2>

                <div
                  id="ventasMenu"
                  className="accordion-collapse collapse"
                  data-bs-parent="#sidebarAccordion"
                >
                  <div className="accordion-body d-flex flex-column gap-2 bg-dark">

                    <Link to="/ventaOffline" className="btn text-white">
                      Ventas
                    </Link>

                    <Link to="/clientes" className="btn text-white">
                      Clientes
                    </Link>

                    <Link to="/envios" className="btn text-white">
                      Envíos
                    </Link>

                    {user?.rol === "ADMINISTRADOR" && (
                      <>
                        <Link to="/ventas" className="btn text-white">
                          Lista de Ventas
                        </Link>

                        <Link to="/pagos" className="btn text-white">
                          Pagos
                        </Link>
                      </>
                    )}

                  </div>
                </div>

              </div>
            )}
          {(user?.rol === "ADMINISTRADOR" ||
            user?.rol === "VENDEDOR") && (

              <div className="accordion-item bg-dark text-white border-0">

                <h2 className="accordion-header">

                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#inventarioMenu"
                  >
                    INVENTARIO
                  </button>

                </h2>

                <div
                  id="inventarioMenu"
                  className="accordion-collapse collapse"
                  data-bs-parent="#sidebarAccordion"
                >
                  <div className="accordion-body d-flex flex-column gap-2 bg-dark">

                    <Link to="/productos" className="btn text-white">
                      Productos
                    </Link>

                    <Link to="/categorias" className="btn text-white">
                      Categorías
                    </Link>

                    {user?.rol === "ADMINISTRADOR" && (
                      <>
                        <Link to="/marcas" className="btn text-white">
                          Marcas
                        </Link>

                        <Link to="/equipos" className="btn text-white">
                          Equipos
                        </Link>

                        <Link to="/colores" className="btn text-white">
                          Colores
                        </Link>

                        <Link to="/tallas" className="btn text-white">
                          Tallas
                        </Link>

                        <Link to="/variantes" className="btn text-white">
                          Variantes
                        </Link>

                        <Link to="/movimientosInventario" className="btn text-white">
                          Movimientos
                        </Link>
                      </>
                    )}

                  </div>
                </div>

              </div>
            )}
          {user?.rol === "ADMINISTRADOR" && (

            <div className="accordion-item bg-dark text-white border-0">

              <h2 className="accordion-header">

                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#adminMenu"
                >
                 ADMINISTRACION
                </button>

              </h2>

              <div
                id="adminMenu"
                className="accordion-collapse collapse"
                data-bs-parent="#sidebarAccordion"
              >
                <div className="accordion-body d-flex flex-column gap-2 bg-dark">

                  <Link to="/usuarios" className="btn text-white">
                    Usuarios
                  </Link>

                  <Link to="/empleados" className="btn text-white">
                    Empleados
                  </Link>

                  <Link to="/roles" className="btn text-white">
                    Roles
                  </Link>

                  <Link to="/sucursales" className="btn text-white">
                    Sucursales
                  </Link>

                  <Link to="/logs" className="btn text-white">
                    Logs
                  </Link>

                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}