import React, { useState } from 'react';
import { Star, Trophy, Calendar, Award, ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sporthausen-neutral-light">
      <Header userType="guest" isOpen={menuOpen} setIsOpen={setMenuOpen} />

      {/* Hero Section — Azul Marina Profundo */}
      <section className="bg-gradient-to-br from-sporthausen-primary via-[#1d3057] to-[#0d1a2b] pt-20 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-sporthausen-secondary animate-pulse"></span>
                  <span className="text-sm font-semibold text-white/90">
                    Impulsando el deporte nacional chileno
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-display font-black text-white leading-tight">
                  La Red Profesional del Deporte
                </h1>

                <p className="text-lg text-white/70 leading-relaxed max-w-xl">
                  Conecta luchadores, bookers y agrupaciones deportivas. Construye tu reputación, encuentra oportunidades y crece profesionalmente en un solo lugar.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-sporthausen-accent text-white font-bold text-lg rounded-lg hover:bg-[#c94a2e] transition-all shadow-lg shadow-sporthausen-accent/30 hover:-translate-y-1"
                >
                  Comenzar Ahora
                  <ArrowRight size={22} />
                </Link>
                <button className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-bold text-lg rounded-lg border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all">
                  Ver Demo
                  <span>→</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-2 border-t border-white/15">
                <div>
                  <p className="text-3xl font-bold text-sporthausen-secondary">500+</p>
                  <p className="text-sm text-white/60">Luchadores Verificados</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-sporthausen-secondary">1200+</p>
                  <p className="text-sm text-white/60">Eventos Realizados</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-sporthausen-secondary">98%</p>
                  <p className="text-sm text-white/60">Satisfacción</p>
                </div>
              </div>
            </div>

            {/* Right - Hero Card Preview */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-sporthausen-secondary/20 to-sporthausen-accent/20 rounded-3xl blur-3xl"></div>

                {/* Hero card */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="space-y-4">
                    {/* Profile Card Preview */}
                    <div className="bg-white rounded-xl p-5 shadow-md">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-sporthausen-primary to-sporthausen-secondary rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="font-bold text-sporthausen-primary">Carlos "El León"</p>
                          <p className="text-sm text-slate-500">Luchador • 5 años exp</p>
                          <div className="flex gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className="fill-sporthausen-secondary text-sporthausen-secondary" />
                            ))}
                          </div>
                        </div>
                        <span className="badge-teal text-xs">Pro</span>
                      </div>
                    </div>

                    {/* Calendar Preview */}
                    <div className="bg-white rounded-xl p-4 shadow-md">
                      <p className="text-xs font-semibold text-slate-500 mb-3">Disponibilidad</p>
                      <div className="grid grid-cols-7 gap-1.5">
                        {[...Array(14)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-7 h-7 rounded text-xs flex items-center justify-center font-bold ${
                              i % 3 === 0 ? 'cal-disponible' : 'cal-ocupado'
                            }`}
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-sporthausen-secondary/10 text-sporthausen-secondary text-sm font-bold rounded-full mb-4 uppercase tracking-wide">
              Por qué elegirnos
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-sporthausen-primary mb-4">
              La Plataforma del Deporte
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Todo lo que necesitas para profesionalizar tu carrera deportiva
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users size={36} className="text-sporthausen-secondary" />,
                title: 'Red Verificada',
                desc: 'Conecta con bookers y luchadores profesionales verificados. Elimina intermediarios innecesarios.',
                color: 'bg-sporthausen-secondary/10'
              },
              {
                icon: <Calendar size={36} className="text-sporthausen-primary" />,
                title: 'Gestión Inteligente',
                desc: 'Calendario interactivo, disponibilidad clara y sincronización automática de eventos.',
                color: 'bg-sporthausen-primary/10'
              },
              {
                icon: <Award size={36} className="text-sporthausen-accent" />,
                title: 'Reputación Verificada',
                desc: 'Construye tu perfil profesional basado en experiencias auditadas y comentarios reales.',
                color: 'bg-sporthausen-accent/10'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 border border-slate-200 rounded-2xl hover:shadow-xl hover:border-sporthausen-secondary/40 hover:-translate-y-1 transition-all duration-300 bg-white"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-sporthausen-primary mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-sporthausen-neutral-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-sporthausen-primary/10 text-sporthausen-primary text-sm font-bold rounded-full mb-4 uppercase tracking-wide">
              Proceso simple
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-sporthausen-primary mb-4">
              Cómo Funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Para Luchadores */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-sporthausen-secondary rounded-lg"></div>
                <h3 className="text-xl font-bold text-sporthausen-primary">Para Luchadores</h3>
              </div>
              <div className="space-y-5">
                {[
                  { num: '1', title: 'Crea tu Perfil', desc: 'Información profesional y verificación' },
                  { num: '2', title: 'Gestiona tu Disponibilidad', desc: 'Calendario inteligente y visible' },
                  { num: '3', title: 'Recibe Oportunidades', desc: 'Bookers te contactan directamente' },
                  { num: '4', title: 'Construye Reputación', desc: 'Calificaciones y comentarios verificados' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-9 h-9 bg-sporthausen-secondary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <p className="font-semibold text-sporthausen-primary">{step.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Para Bookers */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-sporthausen-primary rounded-lg"></div>
                <h3 className="text-xl font-bold text-sporthausen-primary">Para Bookers</h3>
              </div>
              <div className="space-y-5">
                {[
                  { num: '1', title: 'Busca Talento', desc: 'Base de datos filtrable de profesionales' },
                  { num: '2', title: 'Verifica Perfiles', desc: 'Información completa y verificada' },
                  { num: '3', title: 'Contacta Directamente', desc: 'Propuestas y ofertas sin intermediarios' },
                  { num: '4', title: 'Gestiona Contratos', desc: 'Sistema integrado de órdenes y pagos' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-9 h-9 bg-sporthausen-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <p className="font-semibold text-sporthausen-primary">{step.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ofertas Destacadas de la Semana */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sporthausen-accent/10 border border-sporthausen-accent/30 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-sporthausen-accent"></span>
              <span className="text-sm font-semibold text-sporthausen-accent">Actualizado esta semana</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-sporthausen-primary mb-4">
              Ofertas Destacadas
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Las mejores oportunidades de esta semana para luchadores profesionales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                org: 'FNL',
                titulo: 'Luchador Estelar',
                desc: 'Evento principal en Santiago. Se busca talento técnico con 3+ años de experiencia.',
                fecha: '20 Jun 2026',
                tarifa: '$200.000 CLP',
                lugar: 'Santiago',
                tag: 'Destacado',
              },
              {
                org: 'WKC',
                titulo: 'Combate de Campeonato',
                desc: 'Disputa del cinturón regional. Experiencia en combates de título requerida.',
                fecha: '5 Jul 2026',
                tarifa: '$350.000 CLP',
                lugar: 'Valparaíso',
                tag: 'Urgente',
              },
              {
                org: '5LC',
                titulo: 'Lucha de Apertura',
                desc: 'Show familiar. Buen ambiente y público. Perfecto para luchadores emergentes.',
                fecha: '12 Jul 2026',
                tarifa: '$80.000 CLP',
                lugar: 'Concepción',
                tag: 'Nuevo',
              },
            ].map((oferta, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-sporthausen-secondary/50 hover:-translate-y-1 transition-all duration-300 bg-white group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-sporthausen-primary to-sporthausen-secondary rounded-xl flex items-center justify-center text-white font-black text-base">
                    {oferta.org}
                  </div>
                  <span className={`pill text-xs ${
                    oferta.tag === 'Urgente' ? 'pill-accent' :
                    oferta.tag === 'Destacado' ? 'pill-teal' :
                    'pill-primary'
                  }`}>{oferta.tag}</span>
                </div>
                <p className="text-xs font-bold text-sporthausen-secondary mb-1 uppercase tracking-wide">{oferta.org}</p>
                <h3 className="text-lg font-bold text-sporthausen-primary mb-2">{oferta.titulo}</h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">{oferta.desc}</p>
                <div className="flex justify-between items-center text-sm text-slate-400 mb-4 border-t border-slate-100 pt-3">
                  <span>📍 {oferta.lugar}</span>
                  <span>📅 {oferta.fecha}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-sporthausen-primary text-lg">{oferta.tarifa}</p>
                  <Link to="/signup" className="px-4 py-2 bg-sporthausen-accent text-white rounded-lg text-sm font-semibold hover:bg-[#c94a2e] transition-colors shadow-sm">
                    Postular
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-sporthausen-primary text-sporthausen-primary font-bold rounded-lg hover:bg-sporthausen-neutral-light transition-all">
              Ver Todas las Ofertas
              <Trophy size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA — Navy Gradient */}
      <section className="py-24 px-4 bg-gradient-to-br from-sporthausen-primary via-[#1d3057] to-[#0d1a2b]">
        <div className="max-w-4xl mx-auto text-center text-white space-y-8">
          <h2 className="text-5xl md:text-6xl font-display font-black">
            ¿Listo para Comenzar?
          </h2>
          <p className="text-xl text-white/70">
            Únete a la plataforma que está transformando el deporte profesional en Chile
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-10 py-4 bg-sporthausen-accent text-white font-bold text-lg rounded-lg hover:bg-[#c94a2e] transition-all shadow-lg shadow-sporthausen-accent/30"
            >
              Registrarme como Luchador
            </Link>
            <Link
              to="/signup"
              className="px-10 py-4 bg-white/10 text-white font-bold text-lg rounded-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all"
            >
              Registrarme como Booker
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;