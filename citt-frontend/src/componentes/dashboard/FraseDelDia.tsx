import React, { useMemo } from "react";
import { Quote } from "lucide-react";

// Lista de frases random
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

const COLORES_POR_ROL: Record<string, { gradient: string; text: string; textDark: string; line: string }> = {
  ALUMNO:       { gradient: "from-purple-50 via-white to-purple-50", text: "text-purple-600", textDark: "text-purple-900", line: "bg-purple-300" },
  AYUDANTE:     { gradient: "from-green-50 via-white to-green-50", text: "text-green-600", textDark: "text-green-900", line: "bg-green-300" },
  DOCENTE:      { gradient: "from-blue-50 via-white to-blue-50", text: "text-blue-600", textDark: "text-blue-900", line: "bg-blue-300" },
  COORDINADOR:  { gradient: "from-orange-50 via-white to-orange-50", text: "text-orange-600", textDark: "text-orange-900", line: "bg-orange-300" },
  DIRECTOR:     { gradient: "from-orange-50 via-white to-orange-50", text: "text-orange-600", textDark: "text-orange-900", line: "bg-orange-300" },
};

const COLOR_DEFAULT = { gradient: "from-slate-50 via-white to-slate-50", text: "text-slate-600", textDark: "text-slate-900", line: "bg-slate-300" };

export const FraseDelDia: React.FC = () => {
  // Sacamos una frase random solo al cargar el componente
  const fraseAleatoria = useMemo(() => {
    return FRASES_CELEBRES[Math.floor(Math.random() * FRASES_CELEBRES.length)];
  }, []);

  const rolActivo = localStorage.getItem("activeRole") || "";
  const colores = COLORES_POR_ROL[rolActivo] || COLOR_DEFAULT;

  return (
    <div className={`relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-sm border border-white flex flex-col justify-center items-center text-center bg-gradient-to-br ${colores.gradient}`}>
      {/* Marcas de agua decorativas */}
      <Quote className={`absolute -top-6 -left-6 w-40 h-40 opacity-[0.03] -rotate-12 ${colores.textDark} pointer-events-none`} />
      <Quote className={`absolute -bottom-6 -right-6 w-40 h-40 opacity-[0.03] rotate-12 ${colores.textDark} pointer-events-none`} />
      
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <Quote className={`w-8 h-8 mb-6 opacity-40 ${colores.text}`} />
        
        <p className={`text-2xl md:text-3xl lg:text-4xl font-serif italic font-medium leading-relaxed mb-8 ${colores.textDark}`}>
          "{fraseAleatoria.texto}"
        </p>
        
        <div className="flex items-center justify-center gap-4 w-full">
          <div className={`h-[2px] w-12 md:w-24 rounded-full opacity-50 ${colores.line}`} />
          <span className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] ${colores.text}`}>
            {fraseAleatoria.autor}
          </span>
          <div className={`h-[2px] w-12 md:w-24 rounded-full opacity-50 ${colores.line}`} />
        </div>
      </div>
    </div>
  );
};
