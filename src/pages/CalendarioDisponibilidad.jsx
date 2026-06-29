import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Calendar, Clock, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import SideNav from '../components/SideNav';
import { getFechas, upsertFecha, deleteFecha } from '../services/disponibilidadService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const fetchMarcasPendientes = async () => {
  const token = sessionStorage.getItem('authToken');
  const res = await fetch(`${API_BASE}/api/disponibilidad/pendientes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.marcas || [];
};

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_NAMES = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

const toApiDate = (date, month, year) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

const fromApiDate = (fechaStr) => {
  const [y, m, d] = fechaStr.split('-').map(Number);
  return { date: d, month: m - 1, year: y };
};

export const CalendarioDisponibilidad = () => {
  const today = new Date();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [modalReason, setModalReason] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getFechas();
        const items = Array.isArray(data) ? data : (data?.items ?? []);
        const fechasOcupadas = items
          .filter(item => item.status === 'no_disponible')
          .map(item => ({ ...fromApiDate(item.fecha), reason: item.razon || '' }));
        setOccupiedDates(fechasOcupadas);

        // Aplicar marcas pendientes del servidor (postulaciones aceptadas por agrupación)
        try {
          const pending = await fetchMarcasPendientes();
          if (pending.length > 0) {
            const nuevasFechas = [];
            for (const mark of pending) {
              const parsed = fromApiDate(mark.fechaStr);
              const yaExiste = fechasOcupadas.some(o =>
                o.date === parsed.date && o.month === parsed.month && o.year === parsed.year
              );
              if (!yaExiste) {
                try {
                  await upsertFecha(mark.fechaStr, 'no_disponible', mark.razon);
                  nuevasFechas.push({ ...parsed, reason: mark.razon });
                } catch { /* continuar con las otras */ }
              }
            }
            if (nuevasFechas.length > 0) {
              setOccupiedDates(prev => [...prev, ...nuevasFechas]);
              showToast(`${nuevasFechas.length} evento(s) confirmado(s) marcado(s) en tu calendario`);
            }
          }
        } catch { /* no bloquear si falla */ }
      } catch {
        showToast('No se pudo cargar tu disponibilidad', 'error');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const calDays = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const isOccupied = (d, m, y) => occupiedDates.some(o => o.date === d && o.month === m && o.year === y);
  const isPast = (d, m, y) => new Date(y, m, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isToday = (d, m, y) => d === today.getDate() && m === today.getMonth() && y === today.getFullYear();

  const openModal = (date) => {
    const occ = occupiedDates.find(o => o.date === date && o.month === month && o.year === year);
    setModalReason(occ?.reason || '');
    setModal({ date, month, year });
  };

  const toggleDate = async () => {
    const { date, month: m, year: y } = modal;
    const fechaStr = toApiDate(date, m, y);
    setSaving(true);
    try {
      if (isOccupied(date, m, y)) {
        await deleteFecha(fechaStr);
        setOccupiedDates(prev => prev.filter(o => !(o.date === date && o.month === m && o.year === y)));
        showToast('Día marcado como disponible');
      } else {
        await upsertFecha(fechaStr, 'no_disponible', modalReason);
        setOccupiedDates(prev => [...prev, { date, month: m, year: y, reason: modalReason }]);
        showToast('Día marcado como ocupado');
      }
    } catch {
      showToast('Error al guardar el cambio', 'error');
    } finally {
      setSaving(false);
      setModal(null);
      setModalReason('');
    }
  };

  const deleteDate = async (date, m, y) => {
    const fechaStr = toApiDate(date, m, y);
    try {
      await deleteFecha(fechaStr);
      setOccupiedDates(prev => prev.filter(o => !(o.date === date && o.month === m && o.year === y)));
      showToast('Fecha eliminada');
    } catch {
      showToast('Error al eliminar la fecha', 'error');
    }
  };

  const occupiedThisMonth = occupiedDates.filter(o => o.month === month && o.year === year).length;
  const availableThisMonth = daysInMonth - occupiedThisMonth;

  const upcoming = occupiedDates
    .filter(o => {
      const d = new Date(o.year, o.month, o.date);
      const diff = (d - today) / 86400000;
      return diff >= 0 && diff <= 60;
    })
    .sort((a, b) => new Date(a.year, a.month, a.date) - new Date(b.year, b.month, b.date));

  return (
    <div className="min-h-screen bg-sportshausen-light">
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.type === 'error' ? '✕ ' : '✓ '}{toast.msg}
        </div>
      )}

      <Header userType="luchador" isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <SideNav active="calendar" onSelect={() => {}} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col pt-16 md:ml-64">
        <div className="max-w-5xl mx-auto w-full px-4 py-8">

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-sportshausen-dark">Mi Disponibilidad</h1>
            <p className="text-gray-500 mt-1">Marca los días en que estás <strong>ocupado</strong>. Los días sin marcar se muestran como disponibles.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sportshausen-red" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Calendario */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevMonth} className="p-2 hover:bg-sporthausen-neutral-light rounded-lg transition-colors">
                    <ChevronLeft size={22} className="text-sportshausen-red" />
                  </button>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-sportshausen-dark">{MONTH_NAMES[month]}</h2>
                    <p className="text-gray-400 text-sm">{year}</p>
                  </div>
                  <button onClick={nextMonth} className="p-2 hover:bg-sporthausen-neutral-light rounded-lg transition-colors">
                    <ChevronRight size={22} className="text-sportshausen-red" />
                  </button>
                </div>

                <div className="grid grid-cols-7 mb-2">
                  {DAY_NAMES.map(d => (
                    <div key={d} className="text-center text-xs font-bold text-gray-400 py-2">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calDays.map((date, idx) => {
                    if (!date) return <div key={idx} />;
                    const occ = isOccupied(date, month, year);
                    const past = isPast(date, month, year);
                    const tod = isToday(date, month, year);
                    return (
                      <button
                        key={idx}
                        disabled={past}
                        onClick={() => openModal(date)}
                        className={`relative h-12 rounded-xl text-sm font-semibold transition-all focus:outline-none ${
                          past   ? 'bg-gray-100 text-gray-300 cursor-not-allowed' :
                          occ    ? 'bg-sportshausen-red text-white shadow-sm hover:bg-red-700' :
                                   'cal-disponible hover:shadow-md'
                        } ${tod && !occ ? 'ring-2 ring-sportshausen-red' : ''}`}
                      >
                        {date}
                        {tod && (
                          <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${occ ? 'bg-red-200' : 'bg-sportshausen-red'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-5 mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg" style={{background:'#FFF3C0',border:'1.5px solid #FFD100'}} />
                    <span className="text-xs text-gray-600">Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-sportshausen-red" />
                    <span className="text-xs text-gray-600">Ocupado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-gray-100" />
                    <span className="text-xs text-gray-600">Pasado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg cal-disponible ring-2 ring-sportshausen-red" />
                    <span className="text-xs text-gray-600">Hoy</span>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <h3 className="font-bold text-sportshausen-dark mb-4 flex items-center gap-2">
                    <Calendar size={16} className="text-sportshausen-red" />
                    {MONTH_NAMES[month]}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Días disponibles</span>
                      <span className="font-bold text-sportshausen-dark text-lg">{availableThisMonth}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-sportshausen-gold transition-all" style={{ width: `${(availableThisMonth / daysInMonth) * 100}%` }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Días ocupados</span>
                      <span className="font-bold text-sportshausen-red text-lg">{occupiedThisMonth}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-sportshausen-red transition-all" style={{ width: `${(occupiedThisMonth / daysInMonth) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <h3 className="font-bold text-sportshausen-dark mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-sportshausen-red" />
                    Próximas fechas ocupadas
                  </h3>
                  {upcoming.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">Sin fechas ocupadas en los próximos 60 días</p>
                  ) : (
                    <ul className="space-y-2">
                      {upcoming.map((o, i) => (
                        <li key={i} className="flex items-start justify-between gap-2 py-2 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="text-sm font-semibold text-sportshausen-dark">
                              {o.date} de {MONTH_NAMES[o.month]} {o.year !== today.getFullYear() ? o.year : ''}
                            </p>
                            {o.reason && <p className="text-xs text-gray-500 mt-0.5">{o.reason}</p>}
                          </div>
                          <button onClick={() => deleteDate(o.date, o.month, o.year)} className="text-gray-300 hover:text-sportshausen-red transition-colors flex-shrink-0 mt-0.5">
                            <Trash2 size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-sportshausen-gold/10 border border-sportshausen-gold/30 rounded-2xl p-4">
                  <p className="text-xs text-gray-700">
                    <strong>Consejo:</strong> Haz clic en cualquier día futuro para marcarlo como ocupado o disponible.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-sportshausen-dark mb-1">
              {modal.date} de {MONTH_NAMES[modal.month]}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {isOccupied(modal.date, modal.month, modal.year)
                ? 'Este día está marcado como ocupado.'
                : 'Este día está disponible.'}
            </p>
            <label className="block text-sm font-semibold text-sportshausen-dark mb-1">Motivo (opcional)</label>
            <textarea
              value={modalReason}
              onChange={e => setModalReason(e.target.value)}
              placeholder="Ej: Evento, viaje, descanso..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 ring-sporthausen-secondary resize-none mb-4"
              rows={2}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setModal(null); setModalReason(''); }}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-sporthausen-neutral-light"
              >
                Cerrar
              </button>
              <button
                onClick={toggleDate}
                disabled={saving}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${
                  isOccupied(modal.date, modal.month, modal.year)
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'btn-primary'
                }`}
              >
                {saving ? 'Guardando...' : isOccupied(modal.date, modal.month, modal.year) ? (
                  <><X size={15} /> Marcar disponible</>
                ) : (
                  <><Check size={15} /> Marcar ocupado</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioDisponibilidad;
