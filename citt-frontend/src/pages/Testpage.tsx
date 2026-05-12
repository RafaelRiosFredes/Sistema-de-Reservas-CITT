import { Calendar, User, LayoutDashboard, LogOut, Search } from "lucide-react";
import Boton from "../componentes/Boton";
import InputForm from "../componentes/InputForm";
import BadgeEstado from "../componentes/BadgeEstado";

const TestPage = () => {
  return (
    <div className="layout-dashboard">
      <aside className="sidebar-main">
        {/* ... (Sidebar igual que antes) */}
      </aside>

      <main className="p-12 overflow-y-auto w-full">
        <header className="flex justify-between items-center mb-12">
          {/* ... (Header igual que antes) */}
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* USANDO COMPONENTES EN EL FORMULARIO */}
          <div className="card-booking">
            <h3 className="text-center">Prueba de Formulario</h3>
            <InputForm
              label="Correo Institucional"
              type="email"
              placeholder="ejemplo@duocuc.cl"
            />
            <InputForm
              label="Contraseña"
              type="password"
              placeholder="••••••••"
            />
            <Boton bloque>Iniciar Sesión</Boton>
          </div>

          {/* USANDO COMPONENTES EN LAS CARDS */}
          <div className="flex flex-col gap-6">
            <h3>Estado de Salas</h3>
            <div className="card-booking flex justify-between items-center">
              <div>
                <h4 className="font-bold">Sala de Networking</h4>
                <p className="text-sm text-gray-500">Capacidad: 10 personas</p>
              </div>
              <BadgeEstado estado="DISPONIBLE" />
            </div>

            <div className="card-booking flex justify-between items-center border-l-4 border-l-error">
              <div>
                <h4 className="font-bold">Laboratorio de Programación</h4>
                <p className="text-sm text-gray-500">Reservado por: IA Team</p>
              </div>
              <BadgeEstado estado="OCUPADO" />
            </div>

            <div className="flex gap-4">
              <Boton variante="secundario">Volver</Boton>
              <Boton>
                <Search size={18} /> Buscar más salas
              </Boton>
            </div>
          </div>
        </section>

        {/* ... (Calendario igual que antes) */}
      </main>
    </div>
  );
};

export default TestPage;
