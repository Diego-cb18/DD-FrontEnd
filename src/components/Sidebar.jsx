import React from 'react';
import DatePicker from 'react-datepicker';
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);
import logoDefault from '../assets/imgs/logoDefault.png';
import lupaDefault from '../assets/imgs/lupaDefault.png';

function Sidebar({ searchTerm, setSearchTerm, filter, setFilter, selectedDate, handleDateSelect }) {
  return (
    <aside className="bg-white/40 w-80 min-h-screen px-8 py-10 flex flex-col justify-between fixed left-0 top-0 shadow-md">
      {/* Parte superior */}
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex justify-center py-2">
          <div className="border-2 border-black rounded-2xl px-4 py-2 bg-white/50">
            <img src={logoDefault} alt="Logo" className="w-24 mt-1" />
          </div>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar conductor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/40 w-full px-4 py-4 pr-14 rounded-xl border-2 border-black focus:outline-none"
          />
          <button
            onClick={() => {}}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-800 active:scale-95 transition cursor-pointer"
          >
            <img src={lupaDefault} alt="Buscar" className="w-5 h-5" />
          </button>
        </div>

        {/* Filtros */}
        <div>
          <label className="block text-sm font-semibold mb-1 ml-2">Filtros</label>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-4 pr-10 rounded-xl border-2 border-black focus:outline-none bg-white/40 appearance-none"
            >
              <option value="">Más recientes</option>
              <option value="Mas antiguos">Más antiguos</option>
              <option value="Revisado">Revisado</option>
              <option value="No revisado">No revisado</option>
              <option value="Mayor gravedad">Mayor gravedad</option>
              <option value="Menor gravedad">Menor gravedad</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Datepicker */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1 ml-2">Fecha</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateSelect}
            inline
            locale="es"
            dateFormat="dd/MM/yyyy"
            calendarClassName="custom-calendar"
            highlightDates={[selectedDate]} 
            />

        </div>
      </div>

      {/* Parte inferior: copyright */}
      <div className="text-center text-lg text-gray-600 mt-6">
        vigIA 2025©
      </div>
    </aside>
  );
}

export default Sidebar;
