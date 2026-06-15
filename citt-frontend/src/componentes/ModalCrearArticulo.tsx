import React, { useState, useEffect } from "react";
import { AlertCircle, Package, AlertTriangle, Info } from "lucide-react";
import Modal from "./Modal";
import InputForm from "./InputForm";
import Boton from "./Boton";
import api from "../api/axiosConfig";

// DTOs para tipar las respuestas de la API
interface CategoriaDTO {
  idCategoria: number;
  nombreCategoria: string;
}

interface EstadoArticuloDTO {
  idEstadoArticulo: number;
  nombreEstado: string;
}

interface ModalCrearArticuloProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categorias: CategoriaDTO[];
}

export const ModalCrearArticulo: React.FC<ModalCrearArticuloProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categorias,
}) => {
  const [estados, setEstados] = useState<EstadoArticuloDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    nombreArticulo: "",
  });

  // Agrupamos el estado en un solo objeto para facilitar su manejo
  const [formData, setFormData] = useState({
    nombreArticulo: "",
    idCategoria: "",
    idEstadoArticulo: "",
    marca: "",
    codigoDuoc: "",
    numeroSerie: "",
    valor: "",
    fechaCompra: "",
    etiqueta: "",
    sfai: "",
    colliers: "",
    comentarios: "",
  });

  // Cargar Estados de Artículo solo cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      const fetchEstados = async () => {
        try {
          const res = await api.get("/estados");
          setEstados(res.data);
          // Auto-seleccionar el estado "DISPONIBLE" si existe
          const disponible = res.data.find(
            (e: EstadoArticuloDTO) => e.nombreEstado === "DISPONIBLE",
          );
          if (disponible) {
            setFormData((prev) => ({
              ...prev,
              idEstadoArticulo: disponible.idEstadoArticulo.toString(),
            }));
          }
        } catch (err) {
          console.error("Error cargando estados:", err);
        }
      };
      fetchEstados();
    } else {
      // Limpieza profunda al cerrar
      setFormData({
        nombreArticulo: "",
        idCategoria: "",
        idEstadoArticulo: "",
        marca: "",
        codigoDuoc: "",
        numeroSerie: "",
        valor: "",
        fechaCompra: "",
        etiqueta: "",
        sfai: "",
        colliers: "",
        comentarios: "",
      });
      setErrorMsg("");
      setFieldErrors({ nombreArticulo: "" });
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFieldErrors({ nombreArticulo: "" });
    let hasError = false;
    
    if (!formData.nombreArticulo.trim()) {
      setFieldErrors({ nombreArticulo: "El nombre es obligatorio" });
      hasError = true;
    }

    // VALIDACIONES BÁSICAS
    if (
      !formData.nombreArticulo.trim() ||
      !formData.idCategoria ||
      !formData.idEstadoArticulo
    ) {
      if (!hasError) {
        setErrorMsg("La categoría y el estado son campos obligatorios.");
      }
      return;
    }
    if (formData.codigoDuoc && formData.codigoDuoc.trim().length !== 13) {
      setErrorMsg("El código DUOC debe tener exactamente 13 caracteres.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // Construimos el payload con solo los campos necesarios y formateados correctamente
      const payload = {
        nombreArticulo: formData.nombreArticulo.trim(),
        idCategoria: Number(formData.idCategoria),
        idEstadoArticulo: Number(formData.idEstadoArticulo),
        marca: formData.marca.trim() || undefined,
        codigoDuoc: formData.codigoDuoc.trim() || undefined,
        numeroSerie: formData.numeroSerie.trim() || undefined,
        valor: formData.valor ? Number(formData.valor) : undefined,
        fechaCompra: formData.fechaCompra || undefined,
        etiqueta: formData.etiqueta.trim() || undefined,
        sfai: formData.sfai.trim() || undefined,
        colliers: formData.colliers.trim() || undefined,
        comentarios: formData.comentarios.trim() || undefined,
      };

      await api.post("/articulos", payload);
      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.mensaje ||
          "Error al registrar el artículo. Verifica los datos ingresados.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Si no hay categorías, mostramos un mensaje específico en lugar del formulario
  if (categorias.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} titulo="Añadir Nuevo Artículo">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Faltan Categorías
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            El sistema requiere que el artículo pertenezca a una familia.
            Actualmente no hay ninguna categoría registrada en la base de datos.
          </p>
          <Boton
            onClick={onClose}
            className="w-full bg-slate-800 hover:bg-slate-900"
          >
            Entendido
          </Boton>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} titulo="Añadir Nuevo Artículo">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}

        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          {/* IDENTIFICACIÓN BÁSICA (Obligatoria/Alta prioridad) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-2">
              <Package size={14} /> Identificación Básica
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputForm
                  type="text"
                  label="Nombre del Artículo *"
                  placeholder="Ej: Monitor Dell 24 pulgadas"
                  name="nombreArticulo"
                  value={formData.nombreArticulo}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldErrors((prev) => ({ ...prev, nombreArticulo: "" }));
                    setErrorMsg("");
                  }}
                  esError={!!fieldErrors.nombreArticulo}
                  mensajeAyuda={fieldErrors.nombreArticulo}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  Categoría *
                </label>
                <select
                  name="idCategoria"
                  value={formData.idCategoria}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Seleccione una categoría
                  </option>
                  {categorias.map((cat) => (
                    <option key={cat.idCategoria} value={cat.idCategoria}>
                      {cat.nombreCategoria}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  Estado Físico *
                </label>
                <select
                  name="idEstadoArticulo"
                  value={formData.idEstadoArticulo}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Seleccione un estado
                  </option>
                  {estados.map((est) => (
                    <option
                      key={est.idEstadoArticulo}
                      value={est.idEstadoArticulo}
                    >
                      {est.nombreEstado}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <InputForm
                  type="text"
                  label="Código Duoc"
                  placeholder="Exactamente 13 caracteres"
                  name="codigoDuoc"
                  value={formData.codigoDuoc}
                  onChange={handleChange}
                />
              </div>

              <div>
                <InputForm
                  type="text"
                  label="Marca"
                  placeholder="Ej: DELL, HP, Apple"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* TRAZABILIDAD Y DETALLES (Opcional) */}
          <div className="space-y-4 px-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <Info size={14} /> Trazabilidad y Detalles Adicionales
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputForm
                type="text"
                label="Número de Serie"
                placeholder="S/N del fabricante"
                name="numeroSerie"
                value={formData.numeroSerie}
                onChange={handleChange}
              />
              <InputForm
                type="date"
                label="Fecha de Compra"
                name="fechaCompra"
                value={formData.fechaCompra}
                onChange={handleChange}
              />
              <InputForm
                type="number"
                label="Valor Estimado ($)"
                placeholder="0.00"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
              />
              <InputForm
                type="text"
                label="SFAI"
                placeholder="Código SFAI"
                name="sfai"
                value={formData.sfai}
                onChange={handleChange}
              />
              <InputForm
                type="text"
                label="Colliers"
                placeholder="Código Colliers"
                name="colliers"
                value={formData.colliers}
                onChange={handleChange}
              />
              <InputForm
                type="text"
                label="Etiqueta"
                placeholder="N° de Etiqueta"
                name="etiqueta"
                value={formData.etiqueta}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                Comentarios Internos
              </label>
              <textarea
                name="comentarios"
                value={formData.comentarios}
                onChange={handleChange}
                placeholder="Observaciones sobre el equipo..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-y"
              />
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <Boton
            type="button"
            variante="secundario"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </Boton>
          <Boton
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200"
          >
            {isLoading ? "Registrando..." : "Registrar Artículo"}
          </Boton>
        </div>
      </form>
    </Modal>
  );
};
