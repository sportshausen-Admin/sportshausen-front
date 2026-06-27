import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, UserPlus, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import WelcomeModal from '../components/WelcomeModal';

export const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'luchador',
    terms: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowWelcomeModal(false);

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }

    if (!formData.terms) {
      setError('Debes aceptar los términos y condiciones');
      setLoading(false);
      return;
    }

    try {
      // Normalizar rol: agrupación -> agrupacion
      let normalizedRole = formData.role ? formData.role.toLowerCase().trim() : 'luchador';
      if (normalizedRole === 'agrupación') normalizedRole = 'agrupacion';
      
      const result = await signup(formData.name, formData.email, formData.password, normalizedRole);

      if (result.success) {
        setShowWelcomeModal(true);

        const redirectTimeout = setTimeout(() => {
          const savedUserType = localStorage.getItem('userType');

          if (!savedUserType) {
            setError('Error al guardar la sesión. Por favor intenta de nuevo.');
            setShowWelcomeModal(false);
            setLoading(false);
            return;
          }

          const dashboardUrl = savedUserType === 'luchador' ? '/panel/luchador' : `/dashboard/${savedUserType}`;
          navigate(dashboardUrl, { replace: true });
        }, 2500);

        return () => clearTimeout(redirectTimeout);
      } else {
        setError(result.error || 'Error al crear la cuenta');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Error de conexión con el servidor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sporthausen-neutral-light">
      <Header userType="guest" />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 pt-24">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-sporthausen-primary hover:text-sporthausen-secondary font-semibold mb-8 transition-colors">
            <ArrowLeft size={20} />
            Volver
          </Link>

          {/* Card */}
          <div className="card-shadow bg-white rounded-2xl p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-sporthausen-primary to-sporthausen-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                <UserPlus size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold text-sportshausen-dark mb-2">
                Regístrate
              </h1>
              <p className="text-gray-600">
                Únete a SportsHausen hoy mismo
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-sportshausen-dark mb-2">
                  {formData.role === 'luchador' ? 'Nombre Artístico' : formData.role === 'booker' ? 'Tu Nombre' : 'Nombre de la Agrupación'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={formData.role === 'luchador' ? 'Tu alias...' : formData.role === 'booker' ? 'Tu nombre...' : 'Nombre de tu agrupación...'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none transition-all"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-sportshausen-dark mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none transition-all"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-sportshausen-dark mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Tu contraseña"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-sporthausen-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-sportshausen-dark mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirma tu contraseña"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none transition-all"
                />
              </div>

              {/* User Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-sportshausen-dark mb-2">
                  ¿Cuál es tu rol?
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ring-sporthausen-secondary outline-none transition-all bg-white"
                >
                  <option value="luchador">🥋 Luchador</option>
                  <option value="booker">📋 Booker</option>
                  <option value="agrupacion">🏢 Agrupación</option>
                </select>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-gray-300 mt-1"
                />
                <span className="text-sm text-gray-600">
                  Acepto los <a href="#" className="text-sporthausen-secondary hover:underline font-semibold">Términos y Condiciones</a> y la <a href="#" className="text-sporthausen-secondary hover:underline font-semibold">Política de Privacidad</a>
                </span>
              </label>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg font-bold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600">
                ¿Ya tienes cuenta?
                <Link to="/login" className="ml-2 text-sporthausen-primary hover:text-sporthausen-secondary font-semibold transition-colors">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-12 space-y-3">
            <div className="flex items-center gap-3">
              <Check size={20} className="text-sporthausen-secondary flex-shrink-0" />
              <span className="text-sm text-gray-600">Acceso inmediato a la plataforma</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={20} className="text-sporthausen-secondary flex-shrink-0" />
              <span className="text-sm text-gray-600">Perfil verificado y profesional</span>
            </div>
            <div className="flex items-center gap-3">
              <Check size={20} className="text-sporthausen-secondary flex-shrink-0" />
              <span className="text-sm text-gray-600">Conecta con tu comunidad deportiva</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <WelcomeModal 
          userName={formData.name}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default SignupPage;

