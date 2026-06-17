import { useState, useEffect, useMemo } from "react";
import { MapPin, Clock, Quote } from "lucide-react";

// Lista de frases random para mostrar abajo
const FRASES_CELEBRES = [
  { texto: "La simplicidad es la sofisticación definitiva.", autor: "Leonardo da Vinci" },
  { texto: "Primero resuelve el problema. Después, escribe el código.", autor: "John Johnson" },
  { texto: "El código es como el humor. Si tienes que explicarlo, es malo.", autor: "Cory House" },
  { texto: "La mejor forma de predecir el futuro es implementarlo.", autor: "Alan Kay" },
  { texto: "Los grandes desarrolladores no nacen, se compilan.", autor: "Anónimo" },
  { texto: "La innovación distingue a un líder de un seguidor.", autor: "Steve Jobs" },
  { texto: "El único modo de hacer un gran trabajo es amar lo que haces.", autor: "Steve Jobs" },
  { texto: "Medir el progreso de la programación por líneas de código es como medir la construcción de un avión por su peso.", autor: "Bill Gates" },
  { texto: "La función de un buen software es hacer que lo complejo parezca simple.", autor: "Grady Booch" },
  { texto: "Hay dos formas de escribir programas sin errores; sólo la tercera funciona.", autor: "Alan J. Perlis" },
  { texto: "Controlar la complejidad es la esencia de la programación informática.", autor: "Brian Kernighan" },
  { texto: "El código limpio siempre parece que fue escrito por alguien a quien le importa.", autor: "Michael Feathers" },
  { texto: "No te preocupes si no funciona bien. Si todo estuviera correcto, no tendrías trabajo.", autor: "Ley de Mosher" },
  { texto: "Hablar es barato. Muéstrame el código.", autor: "Linus Torvalds" },
  { texto: "Cualquier tonto puede escribir código que un ordenador entienda. Los buenos programadores escriben código que los humanos puedan entender.", autor: "Martin Fowler" },
  { texto: "La programación es el arte de decirle a otro humano lo que quieres que la computadora haga.", autor: "Donald Knuth" },
  { texto: "Si debuggear es el proceso de eliminar errores, entonces programar debe ser el proceso de ponerlos.", autor: "Edsger W. Dijkstra" },
  { texto: "La tecnología es solo una herramienta. Para conseguir que los niños trabajen juntos y motivarlos, el profesor es lo más importante.", autor: "Bill Gates" },
  { texto: "Escribir código es como escribir poesía: la elegancia importa.", autor: "Anónimo" },
  { texto: "No documentes el problema, arréglalo.", autor: "Atli Björgvin Oddsson" },
  { texto: "Hazlo funcionar, hazlo correcto, hazlo rápido.", autor: "Kent Beck" },
  { texto: "Antes de que el software pueda ser reutilizable, primero tiene que ser utilizable.", autor: "Ralph Johnson" },
  { texto: "El peligro de que las computadoras se conviertan en humanas no es tan grande como el peligro de que los humanos se conviertan en computadoras.", autor: "Konrad Zuse" },
  { texto: "No automatices procesos ineficientes, rediseñalos.", autor: "Bill Gates" },
  { texto: "La optimización prematura es la raíz de todos los males.", autor: "Donald Knuth" },
  { texto: "Todo gran desarrollador que conozco es impulsado por la curiosidad.", autor: "Anónimo" },
  { texto: "La web como yo la imaginé no existe todavía. El futuro es mucho más grande que el pasado.", autor: "Tim Berners-Lee" },
  { texto: "El buen código es su propia mejor documentación.", autor: "Steve McConnell" },
  { texto: "Una interfaz de usuario es como un chiste. Si tienes que explicarlo, no es muy bueno.", autor: "Martin LeBlanc" },
  { texto: "La tecnología por sí sola no basta. Es el matrimonio con las humanidades lo que hace cantar a nuestro corazón.", autor: "Steve Jobs" },
  { texto: "Si la tecnología no mejora la vida de las personas, entonces no tiene sentido.", autor: "Satya Nadella" },
  { texto: "El hardware es a lo que le puedes dar patadas. El software es a lo que le puedes gritar.", autor: "Anónimo" },
  { texto: "Piensa dos veces, programa una.", autor: "Anónimo" },
  { texto: "El mejor código es no tener código en absoluto.", autor: "Anónimo" },
  { texto: "El software se come al mundo, pero los programadores son sus chefs.", autor: "Marc Andreessen" },
  { texto: "A veces vale la pena quedarse en la cama el lunes, en lugar de pasar el resto de la semana depurando el código del lunes.", autor: "Dan Salomon" },
  { texto: "Los ordenadores son inútiles. Solo te pueden dar respuestas.", autor: "Pablo Picasso" }
];

// Colores del fondo según el rol
const GRADIENTES_POR_ROL: Record<string, string> = {
  ALUMNO:       "bg-linear-to-r from-purple-600 via-purple-700 to-indigo-900",
  AYUDANTE:     "bg-linear-to-r from-green-600 via-green-700 to-emerald-900",
  DOCENTE:      "bg-linear-to-r from-blue-600 via-blue-700 to-slate-900",
  COORDINADOR:  "bg-linear-to-r from-orange-500 via-orange-600 to-amber-800",
  DIRECTOR:     "bg-linear-to-r from-orange-500 via-orange-600 to-amber-800",
};

// Color por defecto si falla el rol
const GRADIENTE_DEFAULT = "bg-linear-to-r from-gray-600 via-gray-700 to-gray-900";

interface HeaderBannerProps {
  pantallaActual: string;
  descripcion?: string;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({ pantallaActual, descripcion }) => {
  const [horaActual, setHoraActual] = useState(new Date());

  // Sacamos una frase random solo al cargar el componente
  const fraseAleatoria = useMemo(() => {
    return FRASES_CELEBRES[Math.floor(Math.random() * FRASES_CELEBRES.length)];
  }, []);

  // Obtenemos el rol del localStorage para pintar el fondo
  const rolActivo = localStorage.getItem("activeRole") || "";
  const gradiente = GRADIENTES_POR_ROL[rolActivo] || GRADIENTE_DEFAULT;

  // Actualizar el reloj cada segundo
  useEffect(() => {
    const intervalo = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  // Funciones para darle formato  a la hora y fecha
  const formatearHora = (fecha: Date) => {
    return fecha.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-CL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    // Agregamos margen (m-6) y esquinas redondeadas (rounded-2xl) para que se vea centrado y flotante
    <div className={`${gradiente} text-white px-8 py-6 m-6 rounded-2xl shadow-xl relative overflow-hidden z-10`}>
      {/* Círculos de adorno de fondo */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />

      {/* --- PARTE DE ARRIBA --- */}
      <div className="flex items-center justify-between relative">
        {/* Izquierda: Muestra en qué pantalla estamos */}
        <div className="flex items-start gap-4 flex-1 pr-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xl font-bold tracking-wide leading-tight">
              {pantallaActual}
            </span>
            {descripcion && (
              <span className="text-sm font-medium opacity-80 mt-1">
                {descripcion}
              </span>
            )}
          </div>
        </div>

        {/* Derecha: Reloj */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold tabular-nums tracking-tight leading-none">
              {formatearHora(horaActual)}
            </div>
            <div className="text-xs opacity-80 capitalize mt-1">
              {formatearFecha(horaActual)}
            </div>
          </div>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="border-t border-white/15 my-4" />

      {/* --- PARTE DE ABAJO: FRASE --- */}
      <div className="flex items-center justify-center gap-2 relative">
        <Quote className="w-4 h-4 opacity-40 shrink-0" />
        <p className="text-sm italic opacity-90 leading-snug">
          {fraseAleatoria.texto}
        </p>
        <span className="text-xs opacity-60 font-semibold whitespace-nowrap ml-1">
          — {fraseAleatoria.autor}
        </span>
      </div>
    </div>
  );
};