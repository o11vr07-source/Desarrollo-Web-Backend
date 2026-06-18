import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MiniCarrito from "../components/MiniCarrito";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div
          className="p-4"
          style={{
            flex: 1,
          }}
        >
          <Outlet />
          <MiniCarrito />
        </div>
      </div>
    </>
  );
}