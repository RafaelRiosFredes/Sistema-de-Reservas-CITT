import React, { useState } from "react";
import {
  Box,
  AlertTriangle,
  User,
  Calendar,
  CheckCircle,
  Package,
  Monitor,
} from "lucide-react";

// --- IMPORTACIÓN DE NUESTRO ARSENAL DE COMPONENTES ---
import Layout from "../componentes/Layout";
import Boton from "../componentes/Boton";
import InputForm from "../componentes/InputForm";
import SelectForm from "../componentes/SelectForm";
import TextareaForm from "../componentes/TextareaForm";
import InputBusqueda from "../componentes/InputBusqueda";
import FiltroBoton from "../componentes/FiltroBoton";
import BadgeEstado from "../componentes/BadgeEstado";
import Modal from "../componentes/Modal";
import ModalExito from "../componentes/ModalExito";
import AvatarEditable from "../componentes/AvatarEditable";
import OpcionRol from "../componentes/OpcionRol";
import Tabs from "../componentes/Tabs";
import StatCard from "../componentes/StatCard";
import TarjetaAccionRapida from "../componentes/TarjetaAccionRapida";
import TarjetaRecurso from "../componentes/TarjetaRecurso";
import TablaDatos from "../componentes/TablaDatos";
import Paginador from "../componentes/Paginador";
import ItemAlerta from "../componentes/ItemAlerta";
import ItemSolicitud from "../componentes/ItemSolicitud";
import CategoriaAccordion from "../componentes/CategoriaAccordion";
import ItemSeleccionArticulo from "../componentes/ItemSeleccionArticulo";
import SelectorHorario from "../componentes/SelectorHorario";
import GraficoOcupacion from "../componentes/GraficoOcupacion";

const TestPage = () => {
  // --- ESTADOS PARA PROBAR LA INTERACTIVIDAD ---
  const [tabActiva, setTabActiva] = useState("dashboard");
  const [modalNormalOpen, setModalNormalOpen] = useState(false);
  const [modalExitoOpen, setModalExitoOpen] = useState(false);
  const [paginaActual, setPaginaActual] = useState(0);
  const [filtroActivo, setFiltroActivo] = useState("todos");
  const [rolSeleccionado, setRolSeleccionado] = useState("alumno");

  // Estados para Reservas
  const [horarioSel, setHorarioSel] = useState<string | null>(null);
  const [articulosExtra, setArticulosExtra] = useState({
    cant: 1,
    seleccionado: false,
  });

  // --- DATOS DE PRUEBA (DUMMY DATA) ---
  const datosTabs = [
    { id: "dashboard", label: "Dashboard & Tarjetas" },
    { id: "forms", label: "Formularios & Modales" },
    { id: "listas", label: "Tablas & Listas" },
    { id: "reservas", label: "Catálogo & Reservas" },
  ];

  const datosGrafico = [
    { dia: "L", porcentaje: 25 },
    { dia: "M", porcentaje: 85 },
    { dia: "X", porcentaje: 45 },
    { dia: "J", porcentaje: 90 },
    { dia: "V", porcentaje: 10 },
  ];

  const horarios = [
    { id: "h1", horaInicio: "08:00", horaFin: "09:00", disponible: false },
    { id: "h2", horaInicio: "09:00", horaFin: "10:00", disponible: true },
    { id: "h3", horaInicio: "10:00", horaFin: "11:00", disponible: true },
  ];

  return (
    <Layout rolActual="Administrador" nombreUsuario="Prueba Dev">
      {/* CABECERA DE LA PÁGINA DE PRUEBAS */}
      <div className="mb-8">
        <h1>Laboratorio de Componentes</h1>
        <p className="text-gray-500">
          Haz clic en todo para verificar que los estados y colores cambien
          correctamente.
        </p>
      </div>

      {/* COMPONENTE: Tabs */}
      <Tabs tabs={datosTabs} activeTab={tabActiva} onTabChange={setTabActiva} />

      {/* ================================================================= */}
      {/* VISTA 1: DASHBOARD Y TARJETAS */}
      {/* ================================================================= */}
      {tabActiva === "dashboard" && (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              titulo="Reservas Pendientes"
              valor={12}
              icono={<AlertTriangle />}
              colorBorde="warning"
            />
            <StatCard
              titulo="Equipos Disponibles"
              valor={42}
              icono={<Box />}
              colorBorde="success"
            />
            <StatCard
              titulo="Usuarios Activos"
              valor={850}
              icono={<User />}
              colorBorde="primary"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-[300px]">
              <GraficoOcupacion datos={datosGrafico} porcentajePromedio={51} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TarjetaAccionRapida
                titulo="Pedir Artículo"
                subtitulo="Laptops, kits..."
                icono={<Package size={32} />}
                onClick={() => alert("Clic!")}
              />
              <TarjetaAccionRapida
                titulo="Reservar Espacio"
                subtitulo="Laboratorios"
                icono={<Monitor size={32} />}
                onClick={() => alert("Clic!")}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* VISTA 2: FORMULARIOS Y MODALES */}
      {/* ================================================================= */}
      {tabActiva === "forms" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Formularios */}
          <div className="bg-white p-8 rounded-xl border border-gray-border shadow-sm">
            <h3 className="mb-6">Inputs y Botones</h3>
            <InputBusqueda placeholder="Buscar alumnos..." className="mb-6" />

            <InputForm
              label="Nombre Completo"
              placeholder="Ej: Juan Pérez"
              mensajeAyuda="Ingresa tu nombre real."
            />
            <InputForm
              label="Correo (Con Error)"
              placeholder="ejemplo@"
              esError={true}
              mensajeAyuda="Correo inválido."
              defaultValue="mal-correo"
            />

            <SelectForm
              label="Sede"
              opciones={[
                { valor: "1", texto: "Valparaíso" },
                { valor: "2", texto: "Viña del Mar" },
              ]}
            />
            <TextareaForm
              label="Motivo de rechazo"
              placeholder="Escribe aquí..."
            />

            <div className="flex gap-4 mt-6">
              <Boton variante="primario">Guardar</Boton>
              <Boton variante="secundario">Cancelar</Boton>
            </div>
          </div>

          {/* Modales y Perfil */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-8 rounded-xl border border-gray-border shadow-sm text-center">
              <h3 className="mb-6">Avatar y Modales</h3>
              <AvatarEditable
                nombreUsuario="Carlos"
                onEditarFoto={() => alert("Cambiando foto")}
              />

              <div className="flex justify-center gap-4 mt-8">
                <Boton onClick={() => setModalNormalOpen(true)}>
                  Abrir Modal Normal
                </Boton>
                <Boton
                  onClick={() => setModalExitoOpen(true)}
                  className="bg-success hover:bg-green-700"
                >
                  Abrir Modal Éxito
                </Boton>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <OpcionRol
                nombreRol="Alumno"
                icono={<User size={32} />}
                seleccionado={rolSeleccionado === "alumno"}
                onClick={() => setRolSeleccionado("alumno")}
              />
              <OpcionRol
                nombreRol="Docente"
                icono={<User size={32} />}
                seleccionado={rolSeleccionado === "docente"}
                onClick={() => setRolSeleccionado("docente")}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* VISTA 3: TABLAS Y LISTAS */}
      {/* ================================================================= */}
      {tabActiva === "listas" && (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex gap-4">
            <FiltroBoton
              label="Todos"
              activo={filtroActivo === "todos"}
              onClick={() => setFiltroActivo("todos")}
            />
            <FiltroBoton
              label="Pendientes"
              activo={filtroActivo === "pend"}
              onClick={() => setFiltroActivo("pend")}
            />
            <FiltroBoton
              label="Devueltos"
              activo={filtroActivo === "dev"}
              onClick={() => setFiltroActivo("dev")}
            />
          </div>

          <TablaDatos columnas={["ID", "Usuario", "Estado", "Acción"]}>
            <tr>
              <td className="p-4 border-b border-gray-border">#1023</td>
              <td className="p-4 border-b border-gray-border font-bold">
                Andrés Morales
              </td>
              <td className="p-4 border-b border-gray-border">
                <BadgeEstado estado="DISPONIBLE" />
              </td>
              <td className="p-4 border-b border-gray-border">
                <Boton variante="secundario">Ver</Boton>
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-border">#1024</td>
              <td className="p-4 border-b border-gray-border font-bold">
                María Soto
              </td>
              <td className="p-4 border-b border-gray-border">
                <BadgeEstado estado="MANTENCION" />
              </td>
              <td className="p-4 border-b border-gray-border">
                <Boton variante="secundario">Ver</Boton>
              </td>
            </tr>
          </TablaDatos>
          <Paginador
            paginaActual={paginaActual}
            totalPaginas={5}
            onCambiarPagina={setPaginaActual}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="mb-4">Alertas (ItemAlerta)</h3>
              <div className="bg-white p-4 rounded-xl border border-gray-border shadow-sm">
                <ItemAlerta
                  titulo="Devolución Atrasada"
                  subtitulo="Juan Pérez - Lente Sony"
                  detalleDerecha="Ayer"
                  estadoCritico={true}
                />
                <ItemAlerta
                  titulo="Reserva Confirmada"
                  subtitulo="Sala Networking"
                  detalleDerecha="10:00 hrs"
                />
              </div>
            </div>
            <div>
              <h3 className="mb-4">Solicitudes (ItemSolicitud)</h3>
              <ItemSolicitud
                tituloArticulo="Meta Quest 3"
                nombreUsuario="Alumno"
                fecha="24-04-2026"
                hora="08:00 hrs"
                estado="PENDIENTE"
                onVerDetalle={() => alert("Detalle")}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* VISTA 4: CATÁLOGO Y RESERVAS */}
      {/* ================================================================= */}
      {tabActiva === "reservas" && (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TarjetaRecurso
              titulo="Espacio CITT 1"
              subtitulo="Laboratorio"
              descripcion="Capacidad: 20 personas."
              estadoFisico="DISPONIBLE"
              textoBoton="Reservar"
              onAction={() => alert("Reservar")}
            />
            <TarjetaRecurso
              titulo="Espacio CITT 2"
              subtitulo="Maker Space"
              descripcion="Impresoras 3D."
              estadoFisico="OCUPADO"
              textoBoton="Reservar"
              onAction={() => {}}
            />
            <TarjetaRecurso
              titulo="Cámara Sony"
              subtitulo="Audiovisual"
              descripcion="Lente 50mm."
              estadoFisico="MANTENCION"
              textoBoton="No Disponible"
              onAction={() => {}}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="mb-4">Catálogo de Alumnos</h3>
              <CategoriaAccordion
                nombreCategoria="Computadores"
                totalDisponibles={12}
                desgloseMarcas={[
                  { marca: "HP", cantidad: 4 },
                  { marca: "MacBook", cantidad: 8 },
                ]}
                onSolicitar={(marca) => alert(`Solicitaste un ${marca}`)}
              />
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-border shadow-sm">
              <h3 className="mb-4">Bloques y Extras</h3>
              <SelectorHorario
                bloques={horarios}
                bloqueSeleccionado={horarioSel}
                onSeleccionar={setHorarioSel}
              />

              <div className="mt-8">
                <ItemSeleccionArticulo
                  idArticulo="art1"
                  nombre="Mouse Inalámbrico"
                  stockDisponible={5}
                  seleccionado={articulosExtra.seleccionado}
                  cantidad={articulosExtra.cant}
                  onToggle={() =>
                    setArticulosExtra({
                      ...articulosExtra,
                      seleccionado: !articulosExtra.seleccionado,
                    })
                  }
                  onChangeCantidad={(id, c) =>
                    setArticulosExtra({ ...articulosExtra, cant: c })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODALES OCULTOS */}
      {/* ================================================================= */}
      <Modal
        isOpen={modalNormalOpen}
        onClose={() => setModalNormalOpen(false)}
        titulo="Modal de Prueba"
        icono={<Calendar />}
      >
        <p className="text-gray-600 mb-6">
          Este es un modal genérico que puedes usar para formularios, detalles o
          confirmaciones.
        </p>
        <Boton bloque onClick={() => setModalNormalOpen(false)}>
          Entendido
        </Boton>
      </Modal>

      <ModalExito
        isOpen={modalExitoOpen}
        onClose={() => setModalExitoOpen(false)}
        titulo="¡Proceso Exitoso!"
        mensaje="El componente funciona a la perfección."
      />
    </Layout>
  );
};

export default TestPage;
