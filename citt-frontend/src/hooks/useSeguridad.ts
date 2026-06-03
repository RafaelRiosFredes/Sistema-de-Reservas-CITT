import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
export const useSeguridad = (rolesPermitidos?: string[]) => {
  const [isVerificando, setIsVerificando] = useState(true);
  const navigate = useNavigate();
  // Convertimos el array a string para evitar bucles de renderizado en el useEffect
  const rolesString = rolesPermitidos ? rolesPermitidos.join(",") : "";
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const response = await api.get("/auth/perfil");
        const usuario = response.data; // Retorna: { email, roles }
        // Sincronizamos el localStorage con los datos reales del servidor
        localStorage.setItem("userEmail", usuario.email);
        localStorage.setItem("userRoles", JSON.stringify(usuario.roles));
        // --- CAPA DE AUTORIZACIÓN ---
        if (rolesPermitidos && rolesPermitidos.length > 0) {
          // Verificamos si el usuario tiene al menos UNO de los roles requeridos
          const tieneRolPermitido = usuario.roles.some((rol: string) =>
            rolesPermitidos.includes(rol),
          );
          if (!tieneRolPermitido) {
            // El usuario está autenticado, pero NO está autorizado para esta zona
            navigate("/"); // Lo mandamos al home o login
            return; // Cortamos la ejecución para no cambiar isVerificando a false
          }
        }
        setIsVerificando(false); // Solo se libera la interfaz si pasa el filtro de rol
      } catch (error) {
        localStorage.clear();
        navigate("/");
      }
    };
    verificarSesion();
    const intervaloLatido = setInterval(() => {
      api.get("/auth/perfil").catch(() => {});
    }, 60000); // Latido cada 60s
    return () => clearInterval(intervaloLatido);
  }, [navigate, rolesString]);
  return { isVerificando };
};
