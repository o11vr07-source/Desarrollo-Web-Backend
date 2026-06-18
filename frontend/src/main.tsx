import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthContext.tsx';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { CarritoProvider } from './context/CarritoContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <AuthProvider>
    <CarritoProvider>
      <App/>
    </CarritoProvider>
  </AuthProvider>
)