import { Calendar, User, LayoutDashboard, LogOut, Search } from 'lucide-react';

const TestPage = () => {
  return (
    <div className="layout-dashboard">
      {/* SIDEBAR MOCKUP */}
      <aside className="sidebar-main">
        <div className="text-2xl font-black text-primary mb-12">
          CITT<span>RESERVAS</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          <a href="#" className="nav-link-custom nav-link-active">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="nav-link-custom">
            <Calendar size={20} /> Mis Reservas
          </a>
          <a href="#" className="nav-link-custom">
            <User size={20} /> Mi Perfil
          </a>
        </nav>

        <div className="mt-auto">
          <a href="#" className="nav-link-custom text-error hover:bg-error/10 hover:text-error">
            <LogOut size={20} /> Cerrar Sesión
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT MOCKUP */}
      <main className="p-12 overflow-y-auto w-full">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1>Panel de Control</h1>
            <p className="text-gray-500">Bienvenido al sistema de gestión de salas CITT.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-border">
            <div className="avatar">JS</div>
            <span className="font-bold">Juan Soto</span>
          </div>
        </header>

        {/* SECCIÓN DE PRUEBA DE COMPONENTES */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* PRUEBA DE FORMULARIO (Basado en tu Auth Card) */}
          <div className="card-booking">
            <h3 className="text-center">Prueba de Formulario</h3>
            <div className="form-group">
              <label className="form-label">Correo Institucional</label>
              <input type="text" className="form-input" placeholder="ejemplo@duocuc.cl" />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input type="password" className="form-input" placeholder="••••••••" />
            </div>
            <button className="btn btn-primary btn-block">Iniciar Sesión</button>
          </div>

          {/* PRUEBA DE CARDS Y BADGES */}
          <div className="flex flex-col gap-6">
            <h3>Estado de Salas</h3>
            
            <div className="card-booking flex justify-between items-center">
              <div>
                <h4 className="font-bold">Sala de Networking</h4>
                <p className="text-sm text-gray-500">Capacidad: 10 personas</p>
              </div>
              <span className="status-badge status-available">Disponible</span>
            </div>

            <div className="card-booking flex justify-between items-center border-l-4 border-l-error">
              <div>
                <h4 className="font-bold">Laboratorio de Programación</h4>
                <p className="text-sm text-gray-500">Reservado por: IA Team</p>
              </div>
              <span className="status-badge status-reserved">Reservado</span>
            </div>

            <div className="flex gap-4">
              <button className="btn btn-secondary">Volver</button>
              <button className="btn btn-primary flex items-center gap-2">
                <Search size={18} /> Buscar más salas
              </button>
            </div>
          </div>
        </section>

        {/* PRUEBA DE CALENDARIO */}
        <section className="mt-12">
          <h3 className="mb-6">Calendario Semanal</h3>
          <div className="calendar-container">
            {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(day => (
              <div key={day} className="bg-primary text-white p-2 text-center font-bold">
                {day}
              </div>
            ))}
            {[...Array(7)].map((_, i) => (
              <div key={i} className="calendar-day-box border-r border-gray-border">
                <small className="text-gray-400">{i + 10}</small>
                {i === 1 && (
                  <div className="bg-primary/20 text-primary text-[10px] p-1 rounded mt-1 font-bold">
                    Reserva CITT
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TestPage;
