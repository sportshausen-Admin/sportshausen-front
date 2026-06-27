import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Users, Star, ArrowRight, Briefcase, Award } from 'lucide-react';
import Header from '../components/Header';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';

const ofertasCampeonatos = [
  {
    id: 1,
    titulo: 'Copa Nacional de Lucha Libre',
    agrupacion: 'FNL — Federación Nacional',
    ciudad: 'Santiago',
    fecha: '25 Mayo 2026',
    cierre: 'Cierre inscripciones: 18 Mayo',
    premio: '$2.500.000 CLP',
    cupos: 16,
    destacado: true,
  },
  {
    id: 2,
    titulo: 'WKC Showdown — Eliminatoria',
    agrupacion: 'World Kombat Championship',
    ciudad: 'Valparaíso',
    fecha: '12 Junio 2026',
    cierre: 'Cierre inscripciones: 04 Junio',
    premio: '$1.800.000 CLP',
    cupos: 12,
  },
  {
    id: 3,
    titulo: 'Batalla Nocturna Clandestino',
    agrupacion: '5 Luchas Clandestino',
    ciudad: 'Concepción',
    fecha: '30 Mayo 2026',
    cierre: 'Cierre inscripciones: 23 Mayo',
    premio: '$900.000 CLP',
    cupos: 8,
  },
  {
    id: 4,
    titulo: 'Open Andino — Categoría Pro',
    agrupacion: 'Andes Pro Wrestling',
    ciudad: 'Antofagasta',
    fecha: '08 Julio 2026',
    cierre: 'Cierre inscripciones: 28 Junio',
    premio: '$1.200.000 CLP',
    cupos: 10,
  },
];

const agrupacionesRecomendadas = [
  {
    id: 1,
    nombre: 'FNL — Federación Nacional',
    ciudad: 'Santiago',
    miembros: 84,
    rating: 4.9,
    descripcion: 'La federación más antigua de Chile. Organiza eventos mensuales en todo el país.',
    inicial: 'F',
  },
  {
    id: 2,
    nombre: 'Agrupación Elite',
    ciudad: 'Valparaíso',
    miembros: 42,
    rating: 4.7,
    descripcion: 'Especializada en eventos premium y campeonatos internacionales.',
    inicial: 'E',
  },
  {
    id: 3,
    nombre: 'WKC Chile',
    ciudad: 'Santiago',
    miembros: 56,
    rating: 4.8,
    descripcion: 'Producción de espectáculos deportivos con alcance latinoamericano.',
    inicial: 'W',
  },
];

const bookersRecomendados = [
  {
    id: 1,
    nombre: 'María González',
    rol: 'Booker — Agrupación Elite',
    eventos: 38,
    rating: 4.9,
    inicial: 'M',
  },
  {
    id: 2,
    nombre: 'Roberto Sánchez',
    rol: 'Booker Independiente',
    eventos: 24,
    rating: 4.6,
    inicial: 'R',
  },
  {
    id: 3,
    nombre: 'Camila Pérez',
    rol: 'Booker — FNL',
    eventos: 51,
    rating: 4.8,
    inicial: 'C',
  },
];

const PanelDeLuchador = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Nombre desde localStorage según el tipo de cuenta
  let displayName = 'Luchador';
  let userId = null;
  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const u = JSON.parse(raw);
      displayName = u.nombre_artistico || u.name || u.email || displayName;
      userId = u.id || null;
    }
  } catch (_) {}

  return (
    <div className="min-h-screen bg-sportshausen-light">
      <Header userType="luchador" isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex pt-16 min-h-screen">
        <SideNav active={null} onSelect={() => {}} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main className="flex-1 md:ml-64 px-4 sm:px-6 lg:px-8 py-10 space-y-12 overflow-y-auto">
        {/* Bienvenida */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-sportshausen-dark">
              Panel del Luchador
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Hola, <span className="font-semibold text-sportshausen-red">{displayName}</span>. Aquí están las oportunidades más recientes para ti.
            </p>
          </div>
          <Link
            to={userId ? `/perfil/${userId}` : '/not-found'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sportshausen-red text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
          >
            Ir a mi perfil
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Ofertas de campeonatos */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="text-sportshausen-red" size={28} />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-sportshausen-dark">
                Ofertas de Campeonatos Recientes
              </h2>
            </div>
            <button
              onClick={() => navigate('/not-found')}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-sportshausen-red hover:text-red-700"
            >
              Ver todas
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ofertasCampeonatos.map((oferta) => (
              <article
                key={oferta.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-sportshausen-red/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    {oferta.destacado && (
                      <span className="inline-block px-3 py-1 mb-2 text-xs font-bold uppercase tracking-wide bg-sportshausen-gold/20 text-sportshausen-dark rounded-full border border-sportshausen-gold/40">
                        Destacado
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-sportshausen-dark">{oferta.titulo}</h3>
                    <p className="text-sm text-sportshausen-red font-semibold mt-1">{oferta.agrupacion}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Premio</p>
                    <p className="text-lg font-bold text-sportshausen-dark">{oferta.premio}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-5">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-sportshausen-red" />
                    {oferta.fecha}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-sportshausen-red" />
                    {oferta.ciudad}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-sportshausen-red" />
                    {oferta.cupos} cupos
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="text-xs">{oferta.cierre}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/not-found')}
                  className="w-full px-4 py-2.5 bg-sportshausen-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Postularme
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Agrupaciones recomendadas */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="text-sportshausen-red" size={28} />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-sportshausen-dark">
                Agrupaciones Recomendadas
              </h2>
            </div>
            <button
              onClick={() => navigate('/not-found')}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-sportshausen-red hover:text-red-700"
            >
              Explorar más
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agrupacionesRecomendadas.map((agr) => (
              <article
                key={agr.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-sportshausen-red/50 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sportshausen-red to-red-700 flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0">
                    {agr.inicial}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-sportshausen-dark leading-tight">{agr.nombre}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin size={14} className="text-sportshausen-red" />
                      {agr.ciudad}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-1">{agr.descripcion}</p>

                <div className="flex items-center justify-between text-sm mb-4 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-gray-700">
                    <Users size={16} className="text-sportshausen-red" />
                    {agr.miembros} miembros
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-sportshausen-dark">
                    <Star size={16} className="fill-sportshausen-gold text-sportshausen-gold" />
                    {agr.rating}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/not-found')}
                  className="w-full px-4 py-2.5 border-2 border-sportshausen-red text-sportshausen-red font-semibold rounded-lg hover:bg-sportshausen-red hover:text-white transition-colors"
                >
                  Ver agrupación
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Bookers recomendados */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Briefcase className="text-sportshausen-red" size={28} />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-sportshausen-dark">
                Bookers Recomendados
              </h2>
            </div>
            <button
              onClick={() => navigate('/not-found')}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-sportshausen-red hover:text-red-700"
            >
              Ver todos
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookersRecomendados.map((booker) => (
              <article
                key={booker.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-sportshausen-red/50 transition-all duration-300 text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sportshausen-gold to-yellow-600 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-4">
                  {booker.inicial}
                </div>
                <h3 className="text-lg font-bold text-sportshausen-dark">{booker.nombre}</h3>
                <p className="text-sm text-sportshausen-red font-semibold mt-1">{booker.rol}</p>

                <div className="flex gap-6 my-5 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Eventos</p>
                    <p className="text-lg font-bold text-sportshausen-dark">{booker.eventos}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Rating</p>
                    <p className="text-lg font-bold text-sportshausen-dark flex items-center justify-center gap-1">
                      <Star size={14} className="fill-sportshausen-gold text-sportshausen-gold" />
                      {booker.rating}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/not-found')}
                  className="w-full mt-auto px-4 py-2.5 bg-sportshausen-dark text-white font-semibold rounded-lg hover:bg-black transition-colors"
                >
                  Contactar
                </button>
              </article>
            ))}
          </div>
        </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default PanelDeLuchador;
