import React, { useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';

const eventos = [
  { id: 1, titulo: 'FNL Doomsday', org: 'Federación Nacional de Lucha', fecha: '23 Mayo 2026', hora: '14:00', lugar: 'Santiago', estado: 'Confirmado' },
  { id: 2, titulo: 'Batalla Nocturna', org: '5 Luchas Clandestino', fecha: '30 Mayo 2026', hora: '21:00', lugar: 'Santiago', estado: 'Pendiente' },
  { id: 3, titulo: 'WKC Showdown', org: 'World Kombat Championship', fecha: '12 Junio 2026', hora: '18:00', lugar: 'Valparaíso', estado: 'Confirmado' },
  { id: 4, titulo: 'Copa Andina', org: 'Andes Pro Wrestling', fecha: '8 Julio 2026', hora: '17:00', lugar: 'Antofagasta', estado: 'Pendiente' },
];

const pasados = [
  { id: 5, titulo: 'FNL Rivals', org: 'FNL', fecha: '10 Abril 2026', lugar: 'Santiago', resultado: 'Victoria' },
  { id: 6, titulo: 'Night Clash', org: 'WKC', fecha: '20 Marzo 2026', lugar: 'Concepción', resultado: 'Victoria' },
  { id: 7, titulo: 'Open Primavera', org: 'Agrupación Elite', fecha: '5 Marzo 2026', lugar: 'Santiago', resultado: 'Empate' },
];

const MisEventos = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState('proximos');

  return (
    <div className="min-h-screen bg-sportshausen-light">
      <Header userType={localStorage.getItem('userType') || 'luchador'} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex pt-16 min-h-screen">
        <SideNav active="events" onSelect={() => {}} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="flex-1 md:ml-64 px-4 sm:px-6 lg:px-8 py-10 overflow-y-auto">
          <h1 className="text-4xl font-display font-black text-sportshausen-dark mb-2">Mis Eventos</h1>
          <p className="text-gray-600 mb-8">Gestiona tus compromisos y revisa tu historial de participaciones.</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200">
            {[{ id: 'proximos', label: 'Próximos' }, { id: 'pasados', label: 'Historial' }].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 font-semibold text-sm transition-colors border-b-2 -mb-px ${tab === t.id ? 'border-sportshausen-red text-sportshausen-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'proximos' && (
            <div className="space-y-4">
              {eventos.map(ev => (
                <div key={ev.id} className="bg-white rounded-2xl p-6 card-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-sportshausen-red rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sportshausen-dark text-lg">{ev.titulo}</h3>
                      <p className="text-sm text-sportshausen-red font-semibold">{ev.org}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Calendar size={14} />{ev.fecha}</span>
                        <span className="flex items-center gap-1"><Clock size={14} />{ev.hora} hrs</span>
                        <span className="flex items-center gap-1"><MapPin size={14} />{ev.lugar}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${ev.estado === 'Confirmado' ? 'badge-yellow' : 'badge-outline'}`}>
                      {ev.estado === 'Confirmado' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {ev.estado}
                    </span>
                    <button className="btn-outline text-sm px-4 py-2">Ver detalles</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'pasados' && (
            <div className="space-y-4">
              {pasados.map(ev => (
                <div key={ev.id} className="bg-white rounded-2xl p-6 card-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-gray-300 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar size={22} className="text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sportshausen-dark text-lg">{ev.titulo}</h3>
                      <p className="text-sm text-gray-500 font-semibold">{ev.org}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={14} />{ev.fecha}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} />{ev.lugar}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold self-start md:self-auto ${ev.resultado === 'Victoria' ? 'badge-yellow' : 'badge-outline'}`}>
                    {ev.resultado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MisEventos;
