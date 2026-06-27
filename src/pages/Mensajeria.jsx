import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Search, ArrowLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import SideNav from '../components/SideNav';
import * as api from '../services/mensajeriaService';

const POLL_MS = 4000;

const myId = () => {
  try { return parseInt(localStorage.getItem('userId') || '0', 10); } catch { return 0; }
};

const Mensajeria = () => {
  const location = useLocation();
  const preselectedConvId = location.state?.convId;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversaciones, setConversaciones] = useState([]);
  const [convActiva, setConvActiva] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  // Carga lista de conversaciones
  const cargarConversaciones = useCallback(async () => {
    try {
      const data = await api.getConversaciones();
      setConversaciones(Array.isArray(data) ? data : data.items || []);
    } catch (e) {
      setError('No se pudo cargar las conversaciones');
    }
  }, []);

  // Carga mensajes de la conversación activa
  const cargarMensajes = useCallback(async (convId) => {
    try {
      const data = await api.getConversacion(convId);
      const lista = Array.isArray(data) ? data : data.items || [];
      setMensajes(lista);
    } catch (e) {
      // silencioso en polling
    }
  }, []);

  // Al montar: cargar convs
  useEffect(() => {
    cargarConversaciones();
  }, [cargarConversaciones]);

  // Pre-seleccionar conversación si llegamos desde el perfil de otro usuario
  useEffect(() => {
    if (preselectedConvId && conversaciones.length > 0 && !convActiva) {
      const conv = conversaciones.find(c => c.id === preselectedConvId || c.id === parseInt(preselectedConvId));
      if (conv) seleccionarConv(conv);
    }
  }, [preselectedConvId, conversaciones]);

  // Polling de mensajes cuando hay conv activa
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!convActiva) return;

    cargarMensajes(convActiva.id);
    pollRef.current = setInterval(() => cargarMensajes(convActiva.id), POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [convActiva, cargarMensajes]);

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const seleccionarConv = async (conv) => {
    setConvActiva(conv);
    setMensajes([]);
    await api.marcarLeidos(conv.id).catch(() => {});
    setConversaciones(prev =>
      prev.map(c => c.id === conv.id ? { ...c, no_leidos: 0 } : c)
    );
  };

  const enviar = async () => {
    if (!texto.trim() || !convActiva || enviando) return;
    const contenido = texto.trim();
    setTexto('');
    setEnviando(true);
    try {
      const nuevo = await api.enviarMensaje(convActiva.id, contenido);
      setMensajes(prev => [...prev, nuevo]);
      setConversaciones(prev =>
        prev.map(c => c.id === convActiva.id ? { ...c, ultimo_mensaje: contenido } : c)
      );
    } catch {
      setError('No se pudo enviar el mensaje');
      setTexto(contenido);
    } finally {
      setEnviando(false);
    }
  };

  const convsFiltradas = conversaciones.filter(c => {
    const nombre = c.otro_usuario?.nombre_artistico || c.otro_usuario?.name || '';
    return nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

  const yo = myId();

  return (
    <div className="min-h-screen bg-sportshausen-light flex flex-col">
      <Header userType={localStorage.getItem('userType') || 'luchador'} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-1 pt-16 overflow-hidden">
        <SideNav active="messages" onSelect={() => {}} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Panel mensajería */}
        <div className="flex-1 md:ml-64 flex overflow-hidden h-[calc(100vh-4rem)]">

          {/* Lista de conversaciones */}
          <aside className={`w-full md:w-80 border-r border-gray-200 bg-white flex flex-col flex-shrink-0 ${convActiva ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-xl font-display font-bold text-sportshausen-dark mb-3">Mensajes</h2>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                <Search size={16} className="text-gray-400" />
                <input
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar conversación..."
                  className="bg-transparent outline-none text-sm flex-1 text-gray-700"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {error && <p className="text-xs text-red-600 px-4 py-2">{error}</p>}
              {convsFiltradas.length === 0 && (
                <p className="text-sm text-gray-500 px-4 py-6 text-center">Sin conversaciones aún</p>
              )}
              {convsFiltradas.map(conv => {
                const nombre = conv.otro_usuario?.nombre_artistico || conv.otro_usuario?.name || `Usuario ${conv.otro_usuario?.id}`;
                const inicial = nombre[0]?.toUpperCase() || '?';
                const activa = convActiva?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => seleccionarConv(conv)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-sporthausen-neutral-light transition-colors text-left border-b border-gray-50 ${activa ? 'bg-red-50 border-l-4 border-l-sportshausen-red' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-sportshausen-gold flex items-center justify-center text-white font-bold flex-shrink-0">
                      {inicial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-sportshausen-dark text-sm truncate">{nombre}</p>
                        {conv.no_leidos > 0 && (
                          <span className="ml-2 w-5 h-5 bg-sportshausen-red rounded-full text-white text-xs flex items-center justify-center flex-shrink-0">
                            {conv.no_leidos}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{conv.ultimo_mensaje || 'Sin mensajes'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Área de chat */}
          {convActiva ? (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Header del chat */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
                <button onClick={() => setConvActiva(null)} className="md:hidden p-1 hover:bg-sporthausen-neutral-light rounded">
                  <ArrowLeft size={20} />
                </button>
                <div className="w-9 h-9 rounded-full bg-sportshausen-gold flex items-center justify-center text-white font-bold text-sm">
                  {(convActiva.otro_usuario?.nombre_artistico || convActiva.otro_usuario?.name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sportshausen-dark text-sm">
                    {convActiva.otro_usuario?.nombre_artistico || convActiva.otro_usuario?.name || `Usuario ${convActiva.otro_usuario?.id}`}
                  </p>
                  <p className="text-xs text-gray-400">{convActiva.otro_usuario?.role || 'Miembro'}</p>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-sporthausen-neutral-light">
                {mensajes.length === 0 && (
                  <p className="text-center text-sm text-gray-400 pt-8">Inicia la conversación</p>
                )}
                {mensajes.map((msg, i) => {
                  const esMio = msg.remitente_id === yo;
                  return (
                    <div key={msg.id || i} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm ${esMio ? 'bg-sportshausen-red text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'}`}>
                        <p>{msg.contenido}</p>
                        {msg.created_at && (
                          <p className={`text-xs mt-1 ${esMio ? 'text-red-200' : 'text-gray-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                  <input
                    value={texto}
                    onChange={e => setTexto(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviar()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800"
                  />
                  <button
                    onClick={enviar}
                    disabled={!texto.trim() || enviando}
                    className="w-8 h-8 bg-sportshausen-red rounded-lg flex items-center justify-center disabled:opacity-40 transition-opacity"
                  >
                    <Send size={15} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 hidden md:flex items-center justify-center bg-sporthausen-neutral-light flex-col gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <Send size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-semibold">Selecciona una conversación</p>
              <p className="text-sm text-gray-400">Elige un contacto para empezar a chatear</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mensajeria;
