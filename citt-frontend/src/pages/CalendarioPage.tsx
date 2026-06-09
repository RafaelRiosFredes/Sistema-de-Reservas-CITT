import React from 'react';
import { CalendarioEspacios } from '../componentes/CalendarioEspacios';

export const CalendarioPage: React.FC = () => {
  return (
    <div className="w-full h-full min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Calendario de Actividades
          </h1>
          <p className="mt-2 text-lg text-gray-500 font-medium">
            Visualiza la ocupación y reservas de los espacios del CITT en tiempo real.
          </p>
        </header>

        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2">
          <CalendarioEspacios />
        </section>
      </div>
    </div>
  );
};
