import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Filter, X } from 'lucide-react';
import Header from '../components/Header';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import { crearTicket } from '../services/ticketService';
import { getEventos } from '../services/eventosService';
import { crearPostulacion, agregarNotificacionAgrupacion } from '../services/postulacionesService';

const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const fmtFecha = ({ date, month, year }) => `${date} ${meses[month]} ${year}`;

const TIPOS_TICKET = [
  'Consulta sobre evento',
  'Problema con postulación',
  'Reporte de incidente',
  'Otro asunto'
];


const Ofertas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [postulados, setPostulados] = useState([]);
  const [modalTicket, setModalTicket] = useState(null);
  const [eventosApi, setEventosApi] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [ticketForm, setTicketForm] = useState({
    tipo_solicitud: '',
    motivo: '',
  });
  const [enviandoTicket, setEnviandoTicket] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getEventos()
      .then(data => {
        const hoy = Date.now();
        setEventosApi(
          data
            .filter(ev => new Date(ev.fecha.year, ev.fecha.month, ev.fecha.date).getTime() >= hoy)
            .sort((a, b) =>
              new Date(a.fecha.year, a.fecha.month, a.fecha.date) -
              new Date(b.fecha.year, b.fecha.month, b.fecha.date)
            )
        );
      })
      .catch(() => {})
      .finally(() => setLoadingEventos(false));
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const postular = (evento) => {
    const luchadorId = localStorage.getItem('userId');
    const userData = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();
    const luchadorNombre = userData.nombre_artistico || userData.full_name || userData.name || 'Luchador';
    try {
      crearPostulacion({
        luchador_id:          parseInt(luchadorId) || 0,
        luchador_nombre:      luchadorNombre,
        luchador_ciudad:      userData.ciudad || '',
        luchador_peso:        userData.peso || '',
        luchador_estatura:    userData.estatura || '',
        luchador_experiencia: userData.experiencia || '',
        evento_id:            evento.id,
        evento_nombre:        evento.nombre,
        evento_fecha:         evento.fecha,
        agrupacion_id:        evento.agrupacion_id,
      });
      // Notificar a la agrupación organizadora
      if (evento.agrupacion_id) {
        agregarNotificacionAgrupacion(
          evento.agrupacion_id,
          `📋 Nueva postulación de "${luchadorNombre}" para el evento "${evento.nombre}"`,
          { tipo: 'nueva_postulacion', evento_nombre: evento.nombre, luchador_nombre: luchadorNombre }
        );
      }
      setPostulados(prev => [...prev, evento.id]);
      showToast('¡Postulación enviada! La agrupación revisará tu perfil.');
    } catch (err) {
      showToast(err.message || 'Error al postular', 'error');
    }
  };

  const abrirTicket = (oferta) => {
    setModalTicket(oferta);
    setTicketForm({ tipo_solicitud: '', motivo: '' });
  };

  const handleEnviarTicket = async () => {
    if (!ticketForm.tipo_solicitud || ticketForm.motivo.trim().length < 10) {
      showToast('Completa todos los campos (mínimo 10 caracteres)', 'error');
      return;
    }

    setEnviandoTicket(true);
    try {
      await crearTicket({
        tipo_solicitud: ticketForm.tipo_solicitud,
        motivo: ticketForm.motivo.trim(),
        agrupacion_id: modalTicket.org_id,
      });

      showToast('Ticket enviado exitosamente');
      setModalTicket(null);
    } catch (error) {
      showToast('Error al enviar ticket: ' + error.message, 'error');
    } finally {
      setEnviandoTicket(false);
    }
  };

  return (
    <div className="min-h-screen bg-sportshausen-light">
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.type === 'error' ? '✕ ' : '✓ '}{toast.msg}
        </div>
      )}
      <Header userType={localStorage.getItem('userType') || 'luchador'} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex pt-16 min-h-screen">
        <SideNav active="offers" onSelect={() => {}} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="flex-1 md:ml-64 px-4 sm:px-6 lg:px-8 py-10 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-display font-black text-sportshausen-dark mb-2">Ofertas Disponibles</h1>
              <p className="text-gray-600">Encuentra las mejores oportunidades para tu carrera.</p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-200 text-sm text-gray-600">
              <Filter size={16} />
              <span>{eventosApi.length} evento{eventosApi.length !== 1 ? 's' : ''} disponible{eventosApi.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {loadingEventos ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sportshausen-red" />
            </div>
          ) : eventosApi.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
              <p>No hay eventos publicados en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {eventosApi.map(ev => (
                <article key={ev.id} className="bg-white rounded-2xl p-6 card-shadow hover:shadow-lg transition-all border border-transparent hover:border-sportshausen-red/30 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sportshausen-red to-red-700 rounded-xl flex items-center justify-center text-white font-black text-lg">
                      {ev.nombre[0]}
                    </div>
                    <span className="badge-dark">Evento</span>
                  </div>

                  <h3 className="text-xl font-bold text-sportshausen-dark mb-2">{ev.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {ev.luchadores ? `Se buscan ${ev.luchadores} luchadores para este evento.` : 'Evento abierto a postulaciones.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-sportshausen-red" />
                      {fmtFecha(ev.fecha)}
                    </span>
                    {ev.horaInicio && (
                      <span className="flex items-center gap-1 text-gray-500">
                        🕐 {ev.horaInicio}{ev.horaFin ? ` – ${ev.horaFin}` : ''}
                      </span>
                    )}
                    {ev.luchadores && (
                      <span className="flex items-center gap-1">
                        <Users size={14} className="text-sportshausen-red" />{ev.luchadores} cupos
                      </span>
                    )}
                    {ev.duracion && (
                      <span className="text-xs text-gray-400">{ev.duracion} min</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">A consultar</p>
                    <div className="flex gap-2">
                      {postulados.includes(ev.id) ? (
                        <span className="badge-yellow px-4 py-2 text-sm whitespace-nowrap">✓ Postulado</span>
                      ) : (
                        <button
                          onClick={() => postular(ev)}
                          className="btn-primary text-sm px-3 py-2 whitespace-nowrap"
                        >
                          Postularme
                        </button>
                      )}
                      <button
                        onClick={() => abrirTicket({ id: ev.id, org: ev.nombre, org_id: ev.agrupacion_id })}
                        className="btn-outline text-sm px-3 py-2 whitespace-nowrap"
                        title="Enviar una consulta sobre este evento"
                      >
                        🎫 Ticket
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Modal: Crear Ticket */}
          {modalTicket && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-sportshausen-dark">
                    Enviar Consulta
                  </h2>
                  <button
                    onClick={() => setModalTicket(null)}
                    className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  A: <span className="font-semibold">{modalTicket.org}</span>
                </p>

                <div className="space-y-4">
                  {/* Tipo de Solicitud */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Consulta
                    </label>
                    <select
                      value={ticketForm.tipo_solicitud}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, tipo_solicitud: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ring-sportshausen-red outline-none"
                    >
                      <option value="">-- Selecciona --</option>
                      {TIPOS_TICKET.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  {/* Motivo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Detalle
                    </label>
                    <textarea
                      rows={4}
                      value={ticketForm.motivo}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, motivo: e.target.value })
                      }
                      placeholder="Describe tu consulta..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ring-sportshausen-red outline-none resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo 10 caracteres
                    </p>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setModalTicket(null)}
                    className="flex-1 btn-outline"
                    disabled={enviandoTicket}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEnviarTicket}
                    className="flex-1 btn-primary"
                    disabled={enviandoTicket}
                  >
                    {enviandoTicket ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Ofertas;
