import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function MenuGeneral() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: 'reports', label: 'Reportes', path: '/reports', icon: 'lines' },
    { key: 'comments', label: 'Comentarios', path: '/coments', icon: 'comments' },
    { key: 'graph', label: 'Gráfico', path: '/graph', icon: 'graph' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-white/40 text-gray-800 flex flex-col items-center justify-start pt-8 space-y-4 z-40 border-r-2 border-r-gray-500">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => navigate(item.path)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all cursor-pointer ${
            isActive(item.path)
              ? 'bg-[#0C0C0C] text-white border-white scale-105'
              : 'bg-transparent text-gray-500 border-gray-400 hover:bg-[#0C0C0C] hover:text-white hover:border-white hover:scale-105'
          }`}
        >
          {item.icon === 'lines' && (
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-current" />
              <div className="w-6 h-0.5 bg-current" />
              <div className="w-6 h-0.5 bg-current" />
            </div>
          )}
          {item.icon === 'comments' && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14a2 2 0 012 2v7a2 2 0 01-2 2h-5l-4 3-4-3H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
            </svg>
          )}
          {item.icon === 'graph' && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 17V9m4 8V5m4 12v-6" />
            </svg>
          )}
        </button>
      ))}
    </aside>
  );
}

export default MenuGeneral;
