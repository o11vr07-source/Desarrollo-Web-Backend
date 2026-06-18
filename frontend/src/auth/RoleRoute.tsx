import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface Props {
  children: React.ReactNode;
  roles: string[];
}

export default function RoleRoute({
  children,
  roles,
}: Props) {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!roles.includes(user.rol)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}