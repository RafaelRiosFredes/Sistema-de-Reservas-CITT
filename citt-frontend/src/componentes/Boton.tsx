import React from "react";

interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primario" | "secundario";
  bloque?: boolean;
}

const Boton: React.FC<BotonProps> = ({
  children,
  variante = "primario",
  bloque = false,
  ...props
}) => {
  const claseVariante =
    variante === "primario" ? "btn-primary" : "btn-secondary";
  const claseBloque = bloque ? "btn-block" : "";

  return (
    <button className={`btn ${claseVariante} ${claseBloque}`} {...props}>
      {children}
    </button>
  );
};

export default Boton;
