import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias";
import Marcas from "./pages/Marcas";
import Equipos from "./pages/Equipos";
import Productos from "./pages/Productos";
import Colores from "./pages/Colores";
import Tallas from "./pages/Tallas";
import Variantes from "./pages/Variantes";
import Clientes from "./pages/Clientes";
import Empleados from "./pages/Empleados";
import Sucursales from "./pages/Sucursales";
import Roles from "./pages/Roles";
import Usuarios from "./pages/Usuarios";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./auth/RoleRoute";
import Logs_Accesos from "./pages/LogsAccesos";
import CarritoPage from "./pages/Carrito";
import VerificarCliente from "./pages/VerificarCliente";
import RegistroCliente from "./pages/RegistroCliente";
import ActivarCuenta from "./pages/ActivarCuenta";
import Catalogo from "./pages/Catalogo";
import VentasOffline from "./pages/VentasOffline";
import MovimientosInventario from "./pages/MovimientosInventario";
import PagosPage from "./pages/Pagos";
import EnviosPage from "./pages/Envios";
import VentasPage from "./pages/Ventas";
import DetalleVentaPage from "./pages/DetalleVenta";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Públicas */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/verificar-cliente" element={<VerificarCliente />} />
        <Route path="/registro-cliente" element={<RegistroCliente />} />
        <Route path="/activar-cuenta" element={<ActivarCuenta />} />
        <Route path="/home" element={<Home/>}/>

        {/* Privadas */}

        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/empleados" element={<RoleRoute roles={["ADMINISTRADOR"]}><Empleados /></RoleRoute>} />
          <Route path="/usuarios" element={<RoleRoute roles={["ADMINISTRADOR"]}><Usuarios /></RoleRoute>} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/sucursales" element={<Sucursales />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/marcas" element={<Marcas />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/colores" element={<Colores />} />
          <Route path="/tallas" element={<Tallas />} />
          <Route path="/variantes" element={<Variantes />} />
          <Route path="/logs" element={<Logs_Accesos />} />
          <Route path="/catalogo" element={<Catalogo/>}/>
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/ventas" element={<VentasPage />} />
          <Route path="/ventas/:id" element={<DetalleVentaPage />} />
          <Route path="/ventaOffline" element={<VentasOffline />} />
          <Route path="/pagos" element={<PagosPage />} /> 
          <Route path="/envios" element={<EnviosPage />} /> 
          <Route path="/movimientosInventario" element={<MovimientosInventario />} /> 
                   
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;