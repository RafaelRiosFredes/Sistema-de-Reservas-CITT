import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export const useSeguridad = (rolesPermitidos?: string[]) => {
  const [isVerificando, setIsVerificando] = useState(false); 
  const navigate = useNavigate();
  
  const rolesString = rolesPermitidos ? rolesPermitidos.join(",") : "";

  useEffect(() => {
    // Si necesitas ver la vista de alumno o admin para probar sin login, puedes descomentarlo:
    // localStorage.setItem("userEmail", "admin@duoc.cl");
    // localStorage.setItem("userRoles", JSON.stringify([{ authority: "ADMIN" }]));
  }, [navigate, rolesString]);

  return { isVerificando };
};