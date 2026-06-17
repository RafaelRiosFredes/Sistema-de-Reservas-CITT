import React from 'react';
import { CalendarioEspacios } from '../componentes/CalendarioEspacios';

export const CalendarioPage: React.FC = () => {
  return (
    <div className="w-full h-full min-h-screen bg-transparent p-2">
      <div className="w-full mx-auto">
        <CalendarioEspacios />
      </div>
    </div>
  );
};
