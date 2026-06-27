import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ticketsAgrupacion,
  cambiarPrioridad,
  enviarMensajeAgrupacion,
  finalizarTicket,
  obtenerMensajes,
} from '../services/ticketService';
import Modal from '../components/Modal';
import Header from '../components/Header';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import { ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';

const ESTADO_BADGE = { ABIERTO: 'pendiente', EN_PROCESO: 'confirmada', CERRADO: 'completada' };
const ESTADO_LABEL = { ABIERTO: 'Abierto', EN_PROCESO: 'En proceso', CERRADO: 'Cerrado' };

const PRIORIDADES = [
  { value: 'BAJA', label: 'Baja', color: '#6B8F71' },
  { value: 'MEDIANA', label: 'Mediana', color: '#4E7D9E' },
  { value: 'ALTA', label: 'Alta', color: '#C4956A' },
  { value: 'URGENTE', label: 'Urgente', color: '#C0392B' },
];

const prioridadColor = (p) => PRIORIDADES.find((x) => x.value === p)?.color ?? '#888';
const prioridadLabel = (p) => PRIORIDADES.find((x) => x.value === p)?.label ?? p;

export default function GestionarTicketsAgrupacion() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');

  // Modal: detalles + chat
  const [modalDetalle, setModalDetalle] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [textoChat, setTextoChat] = useState('');
  const [enviando, setEnviando] = useState(false);
  const chatRef = useRef(null);

  // Modal: mensaje rápido
  const [modalMensaje, setModalMensaje] = useState(null);
  const [textoMensaje, setTextoMensaje] = useState('');
  const [enviandoMsg, setEnviandoMsg] = useState(false);

  // Modal: cambiar prioridad
  const [modalPrioridad, setModalPrioridad] = useState(null);
  const [prioridadSel, setPrioridadSel] = useState('BAJA');
  const [cambiandoPrioridad, setCambiandoPrioridad] = useState(false);

  // Modal: confirmar finalizar
  const [modalFinalizar, setModalFinalizar] = useState(null);
  const [finalizando, setFinalizando] = useState(false);
  const [toast, setToast] = useState(null);
  const [errorCarga, setErrorCarga] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const cargar = async () => {
    setLoading(true);
    setErrorCarga('');
    try {
      const data = await ticketsAgrupacion();
      setTickets(data.tickets || []);
    } catch (error) {
      setErrorCarga('No se pudieron cargar las solicitudes. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [mensajes]);

  // Filtros combinados
  const ticketsFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return tickets.filter((t) => {
      if (filtroEstado !== 'todos' && t.estado !== filtroEstado) return false;
      if (filtroPrioridad !== 'todas' && t.prioridad !== filtroPrioridad) return false;
      if (q) {
        const numTicket = `tkt-${String(t.id).padStart(4, '0')}`;
        if (!numTicket.includes(q)) return false;
      }
      return true;
    });
  }, [tickets, busqueda, filtroEstado, filtroPrioridad]);

  const hayFiltros = busqueda || filtroEstado !== 'todos' || filtroPrioridad !== 'todas';

  // Handlers
  const abrirDetalle = async (ticket) => {
    setModalDetalle(ticket);
    setTextoChat('');
    setMensajes([]);
    setLoadingMsg(true);
    try {
      const data = await obtenerMensajes(ticket.id);
      setMensajes(data.mensajes || []);
    } catch (error) {
      showToast('Error al cargar mensajes', 'error');
    } finally {
      setLoadingMsg(false);
    }
  };

  const handleEnviarDesdeDetalle = async () => {
    if (!textoChat.trim() || !modalDetalle) return;
    setEnviando(true);
    try {
      await enviarMensajeAgrupacion(modalDetalle.id, { contenido: textoChat.trim() });
      setTextoChat('');
      const data = await obtenerMensajes(modalDetalle.id);
      setMensajes(data.mensajes || []);
      setTickets((prev) =>
        prev.map((t) => t.id === modalDetalle.id ? { ...t, estado: 'EN_PROCESO' } : t)
      );
      showToast('Mensaje enviado');
    } catch (error) {
      showToast('Error al enviar mensaje', 'error');
    } finally {
      setEnviando(false);
    }
  };

  const handleEnviarMensajeRapido = async () => {
    if (!textoMensaje.trim() || !modalMensaje) return;
    setEnviandoMsg(true);
    try {
      await enviarMensajeAgrupacion(modalMensaje, { contenido: textoMensaje.trim() });
      showToast('Mensaje enviado');
      setModalMensaje(null);
      setTextoMensaje('');
      setTickets((prev) =>
        prev.map((t) => t.id === modalMensaje ? { ...t, estado: 'EN_PROCESO' } : t)
      );
    } catch (error) {
      showToast('Error al enviar mensaje', 'error');
    } finally {
      setEnviandoMsg(false);
    }
  };

  const abrirModalPrioridad = (ticket) => {
    setModalPrioridad(ticket);
    setPrioridadSel(ticket.prioridad ?? 'BAJA');
  };

  const handleCambiarPrioridad = async () => {
    if (!modalPrioridad) return;
    setCambiandoPrioridad(true);
    try {
      const updated = await cambiarPrioridad(modalPrioridad.id, prioridadSel);
      showToast(`Prioridad actualizada a ${prioridadLabel(prioridadSel)}`);
      setTickets((prev) => prev.map((t) => t.id === modalPrioridad.id ? { ...t, prioridad: prioridadSel } : t));
      if (modalDetalle?.id === modalPrioridad.id) setModalDetalle({ ...modalDetalle, prioridad: prioridadSel });
      setModalPrioridad(null);
    } catch (error) {
      showToast('Error al cambiar prioridad', 'error');
    } finally {
      setCambiandoPrioridad(false);
    }
  };

  const handleFinalizar = async () => {
    if (!modalFinalizar) return;
    setFinalizando(true);
    try {
      await finalizarTicket(modalFinalizar);
      showToast('Ticket finalizado');
      setTickets((prev) => prev.map((t) => t.id === modalFinalizar ? { ...t, estado: 'CERRADO' } : t));
      if (modalDetalle?.id === modalFinalizar) setModalDetalle({ ...modalDetalle, estado: 'CERRADO' });
      setModalFinalizar(null);
    } catch (error) {
      showToast('Error al finalizar ticket', 'error');
    } finally {
      setFinalizando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sportshausen-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sportshausen-red"></div>
      </div>
    );
  }

  return (
    <main className="page-content min-h-screen bg-sportshausen-light">
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold transition-all ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.type === 'error' ? '✕ ' : '✓ '}{toast.msg}
        </div>
      )}
      <Header userType="agrupacion" />
      <div className="flex pt-16 min-h-screen">
        <SideNav active="tickets-agrupacion" onSelect={() => {}} />

        <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
          <h1 className="text-4xl font-bold text-sportshausen-dark mb-2">Gestionar Solicitudes</h1>
          <p className="text-gray-600 mb-8">Administra los tickets y consultas de los luchadores</p>

          {/* Banner de error con retry */}
          {errorCarga && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 font-medium">{errorCarga}</p>
              </div>
              <button
                onClick={cargar}
                className="text-sm font-semibold text-red-600 hover:text-red-800 underline whitespace-nowrap"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Filtros */}
          <div className="bg-white rounded-lg p-4 mb-8 card-shadow space-y-4">
            <div>
              <input
                type="text"
                placeholder="Buscar por N° ticket..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 ring-sportshausen-red outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ring-sportshausen-red outline-none"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="ABIERTO">Abierto</option>
                  <option value="EN_PROCESO">En proceso</option>
                  <option value="CERRADO">Cerrado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prioridad</label>
                <select
                  value={filtroPrioridad}
                  onChange={(e) => setFiltroPrioridad(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ring-sportshausen-red outline-none"
                >
                  <option value="todas">Todas las prioridades</option>
                  <option value="BAJA">Baja</option>
                  <option value="MEDIANA">Mediana</option>
                  <option value="ALTA">Alta</option>
                  <option value="URGENTE">Urgente</option>
                </select>
              </div>

              {hayFiltros && (
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setBusqueda('');
                      setFiltroEstado('todos');
                      setFiltroPrioridad('todas');
                    }}
                    className="btn-outline w-full"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabla */}
          {ticketsFiltrados.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg card-shadow">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Sin solicitudes</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg overflow-hidden card-shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">#</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Tipo</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Estado</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Prioridad</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ticketsFiltrados.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-sportshausen-dark">
                        TKT-{String(t.id).padStart(4, '0')}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{t.tipo_solicitud}</td>
                      <td className="px-6 py-4">
                        <span className={`badge badge--${ESTADO_BADGE[t.estado] ?? 'pendiente'}`}>
                          {ESTADO_LABEL[t.estado] ?? t.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span style={{ color: prioridadColor(t.prioridad) }} className="font-semibold">
                          {prioridadLabel(t.prioridad)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirDetalle(t)}
                            className="text-xs btn-primary px-3 py-1"
                          >
                            Ver
                          </button>
                          {t.estado !== 'CERRADO' && (
                            <>
                              <button
                                onClick={() => abrirModalPrioridad(t)}
                                className="text-xs btn-outline px-3 py-1"
                              >
                                Prioridad
                              </button>
                              <button
                                onClick={() => {
                                  setModalMensaje(t.id);
                                  setTextoMensaje('');
                                }}
                                className="text-xs btn-outline px-3 py-1"
                              >
                                Mensaje
                              </button>
                            </>
                          )}
                          {t.estado !== 'CERRADO' && (
                            <button
                              onClick={() => setModalFinalizar(t.id)}
                              className="text-xs btn-outline px-3 py-1 text-red-600"
                            >
                              Finalizar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal: Detalle */}
          {modalDetalle && (
            <Modal
              isOpen={!!modalDetalle}
              onClose={() => setModalDetalle(null)}
              title={`TKT-${String(modalDetalle.id).padStart(4, '0')} — Detalle`}
            >
              <div className="space-y-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Tipo</p>
                    <p className="text-sm text-gray-700 mt-1">{modalDetalle.tipo_solicitud}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Motivo</p>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{modalDetalle.motivo}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Estado</p>
                    <p className={`badge badge--${ESTADO_BADGE[modalDetalle.estado] ?? 'pendiente'} mt-1`}>
                      {ESTADO_LABEL[modalDetalle.estado] ?? modalDetalle.estado}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Conversación</p>
                  <div
                    ref={chatRef}
                    className="bg-gray-50 rounded-lg p-4 h-48 overflow-y-auto space-y-3 mb-4 border border-gray-200"
                  >
                    {loadingMsg ? (
                      <div className="text-center"><div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-sportshausen-red"></div></div>
                    ) : mensajes.length === 0 ? (
                      <p className="text-center text-gray-500 text-sm">Sin mensajes</p>
                    ) : (
                      mensajes.map((m) => (
                        <div
                          key={m.id}
                          className={`p-3 rounded-lg max-w-xs ${m.remitente === 'AGRUPACION' ? 'bg-sportshausen-red/10 ml-auto' : 'bg-blue-100 mr-auto'}`}
                        >
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            {m.remitente === 'AGRUPACION' ? 'Yo' : 'Luchador'}
                          </p>
                          <p className="text-sm text-gray-700">{m.contenido}</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(m.fecha_envio).toLocaleTimeString()}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {modalDetalle.estado !== 'CERRADO' && (
                    <>
                      <textarea
                        rows={2}
                        value={textoChat}
                        onChange={(e) => setTextoChat(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleEnviarDesdeDetalle();
                          }
                        }}
                        placeholder="Escribe un mensaje..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ring-sportshausen-red outline-none resize-none"
                      />
                      <button
                        onClick={handleEnviarDesdeDetalle}
                        disabled={enviando || !textoChat.trim()}
                        className="w-full btn-primary mt-2 disabled:opacity-50"
                      >
                        {enviando ? 'Enviando...' : 'Enviar'}
                      </button>
                    </>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button onClick={() => setModalDetalle(null)} className="flex-1 btn-secondary">
                    Cerrar
                  </button>
                  {modalDetalle.estado !== 'CERRADO' && (
                    <>
                      <button onClick={() => abrirModalPrioridad(modalDetalle)} className="flex-1 btn-outline">
                        Prioridad
                      </button>
                      <button onClick={() => setModalFinalizar(modalDetalle.id)} className="flex-1 btn-outline text-red-600">
                        Finalizar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Modal>
          )}

          {/* Modal: Cambiar Prioridad */}
          {modalPrioridad && (
            <Modal
              isOpen={!!modalPrioridad}
              onClose={() => setModalPrioridad(null)}
              title="Cambiar prioridad"
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Selecciona la prioridad para <strong>TKT-{String(modalPrioridad.id).padStart(4, '0')}</strong>
                </p>
                <div className="space-y-2">
                  {PRIORIDADES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPrioridadSel(p.value)}
                      style={{
                        borderColor: p.color,
                        backgroundColor: prioridadSel === p.value ? `${p.color}20` : 'white',
                        color: p.color
                      }}
                      className={`w-full p-3 rounded-lg border-2 text-left font-semibold transition-all ${prioridadSel === p.value ? 'ring-2 ring-offset-2' : ''}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-4">
                  <button onClick={() => setModalPrioridad(null)} className="flex-1 btn-secondary">
                    Cancelar
                  </button>
                  <button
                    onClick={handleCambiarPrioridad}
                    disabled={cambiandoPrioridad}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {cambiandoPrioridad ? 'Guardando...' : 'Aplicar'}
                  </button>
                </div>
              </div>
            </Modal>
          )}

          {/* Modal: Mensaje Rápido */}
          {modalMensaje && (
            <Modal
              isOpen={!!modalMensaje}
              onClose={() => setModalMensaje(null)}
              title="Enviar mensaje"
            >
              <div className="space-y-4">
                <textarea
                  rows={4}
                  value={textoMensaje}
                  onChange={(e) => setTextoMensaje(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ring-sportshausen-red outline-none resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => setModalMensaje(null)} className="flex-1 btn-secondary">
                    Cancelar
                  </button>
                  <button
                    onClick={handleEnviarMensajeRapido}
                    disabled={enviandoMsg || !textoMensaje.trim()}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {enviandoMsg ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>
            </Modal>
          )}

          {/* Modal: Confirmar Finalizar */}
          {modalFinalizar && (
            <Modal
              isOpen={!!modalFinalizar}
              onClose={() => setModalFinalizar(null)}
              title="Finalizar ticket"
            >
              <div className="space-y-4">
                <p className="text-gray-600">
                  ¿Estás seguro de que deseas finalizar el ticket <strong>TKT-{String(modalFinalizar).padStart(4, '0')}</strong>?
                </p>
                <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
                <div className="flex gap-2">
                  <button onClick={() => setModalFinalizar(null)} className="flex-1 btn-secondary">
                    Cancelar
                  </button>
                  <button
                    onClick={handleFinalizar}
                    disabled={finalizando}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {finalizando ? 'Finalizando...' : 'Finalizar'}
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </main>
      </div>
      <Footer />
    </main>
  );
}
