import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export const useSeguridad = (rolesPermitidos?: string[]) => {
  // 1. Lo iniciamos en FALSE para que no se quede la pantalla de carga
  const [isVerificando, setIsVerificando] = useState(false); 
  const navigate = useNavigate();
  
  const rolesString = rolesPermitidos ? rolesPermitidos.join(",") : "";

  useEffect(() => {
    // =========================================================
    // MODO DESARROLLO LOCAL: Simulamos que estamos logueados
    // =========================================================
    // Forzamos las variables en el navegador para que el sistema crea que somos ADMIN
    localStorage.setItem("userEmail", "admin@citt.cl");
    localStorage.setItem("userRoles", JSON.stringify([{ authority: "ADMIN" }]));
    
    // Si necesitas ver la vista de alumno, cambia la línea de arriba por esta:
    // localStorage.setItem("userRoles", JSON.stringify([{ authority: "ALUMNO" }]));

    /* =========================================================
    CÓDIGO REAL DEL BACKEND (COMENTADO TEMPORALMENTE)
    =========================================================
    const verificarSesion = async () => {
      try {
        const response = await api.get("/auth/perfil");
        const usuario = response.data;
        
        localStorage.setItem("userEmail", usuario.email);
        localStorage.setItem("userRoles", JSON.stringify(usuario.roles));
        
        if (rolesPermitidos && rolesPermitidos.length > 0) {
          const tieneRolPermitido = usuario.roles.some((rol: string) =>
            rolesPermitidos.includes(rol),
          );
          if (!tieneRolPermitido) {
            navigate("/"); 
            return; 
          }
        }
        setIsVerificando(false);
      } catch (error) {
        localStorage.clear();
        navigate("/");
      }
    };
    verificarSesion();
    
    const intervaloLatido = setInterval(() => {
      api.get("/auth/perfil").catch(() => {});
    }, 60000); 
    
    return () => clearInterval(intervaloLatido);
    */
  }, [navigate, rolesString]);

  return { isVerificando };
};