import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export const useSeguridad = (rolesPermitidos?: string[]) => {
  const [isVerificando, setIsVerificando] = useState(true);
  const navigate = useNavigate();

  const rolesString = rolesPermitidos ? rolesPermitidos.join(",") : "";

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const activeRole = localStorage.getItem("activeRole");

    // Si no hay sesión guardada, redirigir al login
    if (!email || !activeRole) {
      localStorage.clear();
      navigate("/");
      return;
    }

    // Si se especificaron roles permitidos, verificar que el rol activo sea uno de ellos
    if (rolesPermitidos && rolesPermitidos.length > 0 && !rolesPermitidos.includes(activeRole)) {
      navigate("/dashboard");
      return;
    }

    setIsVerificando(false);
  }, [navigate, rolesString]);

  return { isVerificando };
};