import React, { useState, useEffect, useRef } from 'react';
import { misTickets, obtenerMensajes, enviarMensajeLuchador } from '../services/ticketService';
import Header from '../components/Header';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import { AlertCircle, CheckCircle, Clock, X, Send, RefreshCw } from 'lucide-react';

const ESTADO_BADGE = {
  ABIERTO: 'badge-outline',
  EN_PROCESO: 'badge-yellow',
  CERRADO: 'badge-success'
};

const ESTADO_LABEL = {
  ABIERTO: 'Abierto',
  EN_PROCESO: 'En proceso',
  CERRADO: 'Cerrado'
};

const MisTicketsLuchador = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [modalDetalle, setModalDetalle] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [loadingMensajes, setLoadingMensajes] = useState(false);
  const [textoRespuesta, setTextoRespuesta] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);
  const [toast, setToast] = useState(null);
  const chatRef = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    cargarTickets();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  const cargarTickets = async () => {
    setLoading(true);
    setErrorCarga('');
    try {
      const data = await misTickets();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error('Error:', error);
      setErrorCarga('No se pudieron cargar tus tickets. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const abrirDetalle = async (ticket) => {
    setModalDetalle(ticket);
    setTextoRespuesta('');
    setMensajes([]);
    setLoadingMensajes(true);
    try {
      const data = await obtenerMensajes(ticket.id);
      setMensajes(data.mensajes || []);
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al cargar mensajes', 'error');
    } finally {
      setLoadingMensajes(false);
    }
  };

  const handleEnviarRespuesta = async () => {
    if (!textoRespuesta.trim() || !modalDetalle) return;

    setEnviandoRespuesta(true);
    try {
      await enviarMensajeLuchador(modalDetalle.id, {
        contenido: textoRespuesta.trim()
      });

      setTextoRespuesta('');
      const data = await obtenerMensajes(modalDetalle.id);
      setMensajes(data.mensajes || []);
      showToast('Mensaje enviado');
    } catch (error) {
      showToast('Error al enviar mensaje: ' + error.message, 'error');
    } finally {
      setEnviandoRespuesta(false);
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
    <div className="min-h-screen bg-sportshausen-light">
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.type === 'error' ? '✕ ' : '✓ '}{toast.msg}
        </div>
      )}
      <Header userType={localStorage.getItem('userType') || 'luchador'} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex pt-16 min-h-screen">
        <SideNav active="tickets" onSelect={() => {}} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="flex-1 md:ml-64 px-4 md:px-8 py-10 overflow-y-auto">
          <h1 className="text-4xl font-bold text-sportshausen-dark mb-2">Mis Tickets</h1>
          <p className="text-gray-600 mb-8">Gestiona tus consultas y seguimiento con agrupaciones</p>

          {errorCarga && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 font-medium">{errorCarga}</p>
              </div>
              <button
                onClick={cargarTickets}
                className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-800 underline whitespace-nowrap"
              >
                <RefreshCw size={14} />
                Reintentar
              </button>
            </div>
          )}

          {tickets.length === 0 && !errorCarga ? (
            <div className="text-center py-12 bg-white rounded-lg card-shadow">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No tienes tickets aún</p>
            </div>
          ) : !errorCarga && (
            <div className="space-y-4">
              {tickets.map(ticket => (
                <div key={ticket.id} className="bg-white rounded-xl p-5 card-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-lg transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-sportshausen-dark">
                        TKT-{String(ticket.id).padStart(4, '0')}
                      </h3>
                      <span className={`${ESTADO_BADGE[ticket.estado]} text-xs font-semibold px-2 py-1 rounded`}>
                        {ESTADO_LABEL[ticket.estado]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{ticket.tipo_solicitud}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Creado: {new Date(ticket.fecha_creacion).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => abrirDetalle(ticket)}
                    className="btn-primary text-sm px-4 py-2 whitespace-nowrap"
                  >
                    Ver detalles
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Modal Detalle */}
          {modalDetalle && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-2xl w-full my-8">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    TKT-{String(modalDetalle.id).padStart(4, '0')}
                  </h2>
                  <button onClick={() => setModalDetalle(null)} className="hover:bg-gray-100 p-2 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Información */}
                  <div className="space-y-3 border-b pb-6">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Estado</p>
                      <p className={`${ESTADO_BADGE[modalDetalle.estado]} inline-block mt-1 text-sm font-semibold px-3 py-1 rounded`}>
                        {ESTADO_LABEL[modalDetalle.estado]}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Tipo de Solicitud</p>
                      <p className="text-sm text-gray-700 mt-1">{modalDetalle.tipo_solicitud}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Motivo</p>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{modalDetalle.motivo}</p>
                    </div>
                  </div>

                  {/* Chat */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Conversación</p>
                    <div
                      ref={chatRef}
                      className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto space-y-3 mb-4 border border-gray-200"
                    >
                      {loadingMensajes ? (
                        <p className="text-center text-gray-500">Cargando...</p>
                      ) : mensajes.length === 0 ? (
                        <p className="text-center text-gray-500 text-sm">Sin mensajes aún</p>
                      ) : (
                        mensajes.map(msg => (
                          <div
                            key={msg.id}
                            className={`p-3 rounded-lg max-w-xs ${msg.remitente === 'LUCHADOR' ? 'bg-sportshausen-red/10 ml-auto' : 'bg-blue-100 mr-auto'}`}
                          >
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              {msg.remitente === 'LUCHADOR' ? 'Yo' : 'Agrupación'}
                            </p>
                            <p className="text-sm text-gray-700">{msg.contenido}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(msg.fecha_envio).toLocaleTimeString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Input */}
                    {modalDetalle.estado !== 'CERRADO' && (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={textoRespuesta}
                          onChange={(e) => setTextoRespuesta(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleEnviarRespuesta();
                            }
                          }}
                          placeholder="Escribe un mensaje... (Enter para enviar)"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 ring-sportshausen-red outline-none resize-none"
                        />
                        <button
                          onClick={handleEnviarRespuesta}
                          disabled={enviandoRespuesta || !textoRespuesta.trim()}
                          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {enviandoRespuesta ? 'Enviando...' : <>
                            <Send size={16} />
                            Enviar
                          </>}
                        </button>
                      </div>
                    )}

                    {modalDetalle.estado === 'CERRADO' && (
                      <div className="bg-gray-100 p-3 rounded-lg text-center text-sm text-gray-600">
                        Este ticket está cerrado
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t p-4 flex gap-2">
                  <button
                    onClick={() => setModalDetalle(null)}
                    className="flex-1 btn-secondary"
                  >
                    Cerrar
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

export default MisTicketsLuchador;
