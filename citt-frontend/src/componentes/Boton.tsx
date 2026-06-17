import React from "react";

interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primario" | "secundario";
  bloque?: boolean;
}

const Boton: React.FC<BotonProps> = ({
  children,
  variante = "primario",
  bloque = false,
  type = "button",
  className,
  ...props
}) => {
  const claseVariante =
    variante === "primario" ? "btn-primary" : "btn-secondary";
  const claseBloque = bloque ? "btn-block" : "";

  return (
    <button
      type={type}
      className={`btn ${claseVariante} ${claseBloque} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Boton;
