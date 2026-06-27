import React, { useState, useEffect, useRef } from 'react';
import { Star, MapPin, Mail, Share2, Phone, Calendar, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import { crearConversacion } from '../services/mensajeriaService';
import { usersAPI } from '../services/api';

export const PerfilLuchador = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const myUserId = localStorage.getItem('userId');
  const isOwnProfile = !id || String(id) === String(myUserId);

  const [showContactModal, setShowContactModal] = useState(false);
  const [connected, setConnected] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewRole, setPreviewRole] = useState('talent');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // luchador declarado antes de los useEffects que lo referencian
  const [luchador, setLuchador] = useState({
    nombre: '',
    nombreLegal: '',
    ciudad: '',
    experiencia: '',
    peso: '',
    estatura: '',
    edad: '',
    calificacion: 0,
    resenas: 0,
    banner: 'bg-gradient-to-r from-sportshausen-red to-sportshausen-dark',
    redes: [
      { icon: Mail, url: '#', name: 'Email' },
      { icon: Share2, url: '#', name: 'Compartir' },
      { icon: Phone, url: '#', name: 'Teléfono' },
    ]
  });
  const [loadingPerfil, setLoadingPerfil] = useState(true);

  // Calendar state
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [occupiedDates, setOccupiedDates] = useState([]);

  // Cargar perfil desde API
  useEffect(() => {
    const targetId = id || myUserId;
    if (!targetId) { setLoadingPerfil(false); return; }
    usersAPI.getProfileById(targetId)
      .then(data => {
        if (data) {
          setLuchador(prev => ({
            ...prev,
            nombre: data.nombre_artistico || data.full_name || data.name || prev.nombre,
            nombreLegal: data.full_name || data.nombre_real || prev.nombreLegal,
            ciudad: data.ciudad || data.city || prev.ciudad,
            experiencia: data.experiencia ?? data.years_experience ?? prev.experiencia,
            peso: data.peso ?? data.weight ?? prev.peso,
            estatura: data.estatura ?? data.height ?? prev.estatura,
            edad: data.edad ?? data.age ?? prev.edad,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingPerfil(false));
  }, [id, myUserId]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('occupiedDates') || '[]');
      setOccupiedDates(saved);
    } catch { setOccupiedDates([]); }
  }, []);

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = (new Date(calYear, calMonth, 1).getDay() + 6) % 7; // Mon=0
  const calDays = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const handleEnviarMensaje = async () => {
    if (enviandoMensaje) return;
    setEnviandoMensaje(true);
    try {
      const conv = await crearConversacion(parseInt(id));
      navigate('/mensajeria', { state: { convId: conv?.id || conv?.conversacion_id } });
    } catch {
      navigate('/mensajeria');
    } finally {
      setEnviandoMensaje(false);
    }
  };

  useEffect(() => {
    if (!luchador.nombre) return;
    try {
      const stored = JSON.parse(localStorage.getItem('connections') || '[]');
      setConnected(stored.includes(luchador.nombre));
    } catch {
      setConnected(false);
    }
  }, [luchador.nombre]);

  // close edit mode when entering preview; keep preview read-only
  React.useEffect(() => {
    if (previewOpen) setEditMode(false);
  }, [previewOpen]);

  const toggleConnect = () => {
    try {
      const key = 'connections';
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      let next = [];
      if (stored.includes(luchador.nombre)) {
        next = stored.filter((n) => n !== luchador.nombre);
        setConnected(false);
      } else {
        next = [...stored, luchador.nombre];
        setConnected(true);
      }
      localStorage.setItem(key, JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };


  return (
    <div className="min-h-screen bg-sporthausen-neutral-light">
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.type === 'error' ? '✕ ' : '✓ '}{toast.msg}
        </div>
      )}
      <Header userType={localStorage.getItem('userType') || 'luchador'} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <SideNav active={'profile'} onSelect={()=>{}} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Banner + Profile Header: only visible in preview mode */}
      {previewOpen && (
        <>
          <div className={`h-48 md:h-64 md:ml-64 ${luchador.banner} relative`}>
            <div className="absolute inset-0 opacity-30 bg-black"></div>
          </div>

          <div className="max-w-6xl mx-auto px-4 md:ml-64 relative -mt-24 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar removed per request (no photos) */}

              {/* Info */}
              <div className="flex-1 pt-8">
                <h1 className="text-4xl md:text-5xl font-bold text-sportshausen-dark mb-2">MI PERFIL</h1>
                <p className="text-xl text-gray-700 mb-4">{luchador.nombre} — <span className="text-sm text-gray-500">{luchador.nombreLegal}</span></p>

                {/* Cagematch-style data box */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left column: quick facts */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Edad</p>
                        <p className="font-bold text-lg text-sportshausen-dark">{luchador.edad}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ciudad</p>
                        <p className="font-bold text-lg text-sportshausen-dark">{luchador.ciudad}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Peso</p>
                        <p className="font-bold text-lg text-sportshausen-dark">{luchador.peso} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estatura</p>
                        <p className="font-bold text-lg text-sportshausen-dark">{luchador.estatura} cm</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Experiencia</p>
                        <p className="font-bold text-lg text-sportshausen-dark">{luchador.experiencia} años</p>
                      </div>
                    </div>

                    {/* Middle column */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Nombre artístico</p>
                        <p className="font-bold text-xl text-sportshausen-dark">{luchador.nombre || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Nombre real</p>
                        <p className="font-semibold text-gray-700">{luchador.nombreLegal || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ciudad</p>
                        <p className="font-semibold text-gray-700">{luchador.ciudad || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Experiencia</p>
                        <p className="font-semibold text-gray-700">{luchador.experiencia ? `${luchador.experiencia} años` : '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={() => setPreviewOpen(false)} className="px-4 py-2 rounded-lg border">Cerrar vista</button>
                  <button onClick={() => setShowContactModal(true)} className="btn-primary">Contactar</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content + Right profile panel grid */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:ml-64 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main profile content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reduced social elements: Redes Sociales section removed to make profile more tool-like */}

          {/* Calendario de Disponibilidad */}
          <section className="bg-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-sportshausen-dark">
                Disponibilidad — {monthNames[calMonth]} {calYear}
              </h2>
              <div className="flex gap-1">
                <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }} className="p-1.5 hover:bg-sporthausen-neutral-light rounded">
                  <ChevronLeft size={18} className="text-sportshausen-red" />
                </button>
                <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }} className="p-1.5 hover:bg-sporthausen-neutral-light rounded">
                  <ChevronRight size={18} className="text-sportshausen-red" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                <div key={day} className="text-center font-bold text-gray-500 text-xs py-1">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calDays.map((date, idx) => {
                if (!date) return <div key={idx} />;
                const isOccupied = occupiedDates.some(d => {
                  const dayMatch = (d.date ?? d) === date;
                  // New format includes month+year; old format was day-only
                  if (d.month !== undefined) return dayMatch && d.month === calMonth && d.year === calYear;
                  return dayMatch;
                });
                const isPast = new Date(calYear, calMonth, date) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                return (
                  <div
                    key={idx}
                    onClick={() => isOwnProfile && !isPast && navigate('/calendario-disponibilidad')}
                    className={`p-2 rounded-lg text-center font-semibold text-sm h-10 flex items-center justify-center transition-all ${
                      isPast ? 'bg-gray-100 text-gray-400' :
                      isOccupied ? 'bg-sportshausen-red text-white' : 'cal-disponible'
                    } ${isOwnProfile && !isPast ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}`}
                  >
                    {date}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{background:'#FFF3C0',border:'1.5px solid #FFD100'}}></div>
                <span className="text-xs text-gray-600">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-sportshausen-red rounded"></div>
                <span className="text-xs text-gray-600">Ocupado</span>
              </div>
              {isOwnProfile && (
                <button onClick={() => navigate('/calendario-disponibilidad')} className="ml-auto text-xs text-sportshausen-red underline">
                  Gestionar disponibilidad →
                </button>
              )}
            </div>
          </section>

          {/* Calificaciones */}
          <section className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-sportshausen-dark mb-6">Calificaciones y Reseñas</h2>
            <div className="space-y-6">
              {[
                { booker: 'Agrupación Elite', comment: 'Profesional, puntual y con gran actitud. Recomendado 100%', rating: 5 },
                { booker: 'Carlos Eventos', comment: 'Excelente desempeño en el evento. Volvería a contratarlo', rating: 5 },
                { booker: 'Lucha Premium', comment: 'Buen trabajo, muy dedicado', rating: 4 },
              ].map((review, idx) => (
                <div key={idx} className="card-shadow bg-white p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-bold text-sportshausen-dark">{review.booker}</p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'fill-sportshausen-gold text-sportshausen-gold' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: profile summary + actions */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nombre Artístico</p>
              <h3 className="text-lg font-bold text-sportshausen-dark">{luchador.nombre}</h3>
              <p className="text-sm text-gray-600">{luchador.nombreLegal}</p>
            </div>

            {!editMode ? (
              <div className="space-y-2 text-sm">
                {luchador.ciudad    && <div className="flex justify-between"><span className="text-gray-500">Ciudad</span><strong>{luchador.ciudad}</strong></div>}
                {luchador.peso      && <div className="flex justify-between"><span className="text-gray-500">Peso</span><strong>{luchador.peso} kg</strong></div>}
                {luchador.estatura  && <div className="flex justify-between"><span className="text-gray-500">Estatura</span><strong>{luchador.estatura} cm</strong></div>}
                {luchador.edad      && <div className="flex justify-between"><span className="text-gray-500">Edad</span><strong>{luchador.edad} años</strong></div>}
                {luchador.experiencia && <div className="flex justify-between"><span className="text-gray-500">Experiencia</span><strong>{luchador.experiencia} años</strong></div>}
                {!luchador.ciudad && !luchador.peso && !luchador.estatura && !luchador.edad && !luchador.experiencia && (
                  <p className="text-gray-400 text-xs italic">Sin datos. Presiona Editar para completar.</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Nombre Artístico</label>
                <input value={luchador.nombre} onChange={(e)=>setLuchador({...luchador,nombre:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-sportshausen-red outline-none" />
                <label className="block text-sm font-medium text-gray-700">Nombre Real</label>
                <input value={luchador.nombreLegal} onChange={(e)=>setLuchador({...luchador,nombreLegal:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-sportshausen-red outline-none" />
                <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                <input value={luchador.ciudad} onChange={(e)=>setLuchador({...luchador,ciudad:e.target.value})} placeholder="Ej: Santiago" className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-sportshausen-red outline-none" />
                <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                <input type="number" value={luchador.peso} onChange={(e)=>setLuchador({...luchador,peso: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-sportshausen-red outline-none" />
                <label className="block text-sm font-medium text-gray-700">Estatura (cm)</label>
                <input type="number" value={luchador.estatura} onChange={(e)=>setLuchador({...luchador,estatura: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-sportshausen-red outline-none" />
                <label className="block text-sm font-medium text-gray-700">Edad</label>
                <input type="number" value={luchador.edad} onChange={(e)=>setLuchador({...luchador,edad: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-sportshausen-red outline-none" />
                <label className="block text-sm font-medium text-gray-700">Experiencia (años)</label>
                <input type="number" value={luchador.experiencia} onChange={(e)=>setLuchador({...luchador,experiencia: Number(e.target.value)})} placeholder="Ej: 5" className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-sportshausen-red outline-none" />
              </div>
            )}

              <div className="flex flex-col gap-2">
                {isOwnProfile ? (
                  <>
                    <div className="flex gap-2">
                      {!previewOpen && (
                        !editMode ? (
                          <button onClick={()=>setEditMode(true)} className="flex-1 px-4 py-2 border rounded font-semibold text-sm">Editar</button>
                        ) : (
                          <>
                            <button
                              disabled={guardando}
                              onClick={async () => {
                                const targetId = id || myUserId;
                                if (!targetId) { setEditMode(false); return; }
                                setGuardando(true);
                                try {
                                  await usersAPI.update(targetId, {
                                    nombre_artistico: luchador.nombre,
                                    full_name: luchador.nombreLegal,
                                    ciudad: luchador.ciudad,
                                    peso: luchador.peso,
                                    estatura: luchador.estatura,
                                    edad: luchador.edad,
                                    experiencia: luchador.experiencia,
                                  });
                                  showToast('Perfil actualizado');
                                } catch {
                                  showToast('Error al guardar', 'error');
                                } finally {
                                  setGuardando(false);
                                  setEditMode(false);
                                }
                              }}
                              className="flex-1 btn-primary text-sm disabled:opacity-50"
                            >
                              {guardando ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button onClick={()=>setEditMode(false)} className="flex-1 px-4 py-2 border rounded font-semibold text-sm">Cancelar</button>
                          </>
                        )
                      )}
                      {!previewOpen ? (
                        <button onClick={()=>setPreviewModal(true)} className="flex-1 btn-primary text-sm">Vista previa</button>
                      ) : (
                        <button onClick={()=>setPreviewOpen(false)} className="flex-1 border rounded text-sm">Cerrar vista</button>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={handleEnviarMensaje}
                    disabled={enviandoMensaje}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <MessageSquare size={16} />
                    {enviandoMensaje ? 'Abriendo chat...' : 'Enviar Mensaje'}
                  </button>
                )}
              </div>
          </div>
        </aside>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-sportshausen-dark mb-6">Propuesta de Evento</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-sportshausen-dark mb-2">
                  Asunto del Evento
                </label>
                <input
                  type="text"
                  placeholder="Ej: Lucha Especial"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sportshausen-dark mb-2">
                  Descripción
                </label>
                <textarea
                  placeholder="Cuéntanos sobre el evento..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none"
                  rows="4"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-sportshausen-dark mb-2">
                  Fecha Propuesta
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-sportshausen-dark mb-2">
                  Tarifa Ofrecida (CLP)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-sporthausen-neutral-light transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Enviar Propuesta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal: choose role, then apply full-page preview */}
      {previewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Vista previa - Rol</h3>
              <div className="flex items-center gap-2">
                <select value={previewRole} onChange={(e)=>setPreviewRole(e.target.value)} className="px-3 py-1 border rounded">
                  <option value="talent">Talento</option>
                  <option value="booker">Booker</option>
                  <option value="group">Agrupación</option>
                </select>
                <button onClick={()=>setPreviewModal(false)} className="px-3 py-1 border rounded">Cancelar</button>
              </div>
            </div>

            <div className="p-4 border rounded mb-4">
              <p className="text-sm text-gray-600">Selecciona cómo quieres ver tu perfil (simulación).</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={()=>setPreviewModal(false)} className="px-4 py-2 border rounded">Cerrar</button>
              <button onClick={() => { setPreviewModal(false); setPreviewOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-4 py-2 btn-primary">Ver como {previewRole === 'talent' ? 'Talento' : previewRole === 'booker' ? 'Booker' : 'Agrupación'}</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PerfilLuchador;

