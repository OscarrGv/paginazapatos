"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

function AuthModal() {
  const {
    isAuthModalOpen, setIsAuthModalOpen,
    authView, setAuthView,
    loginData, setLoginData,
    registerData, setRegisterData,
    recoverEmail, setRecoverEmail,
    authError, setAuthError,
    login, register,
    isLoading
  } = useAppContext();

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const handleSwitchView = (view) => {
    setAuthView(view);
    setAuthError('');
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    login(loginData);
  };

  const handleSubmitRegister = (e) => {
    e.preventDefault();
    register(registerData);
  };

  const handleSubmitRecover = (e) => {
    e.preventDefault();
    setAuthError('Recuperación no implementada aún');
  };

  return (
    <div className={`auth-modal${isAuthModalOpen ? ' active' : ''}`} aria-hidden={!isAuthModalOpen}>
      <div className="auth-modal-content">
        <div className="auth-forms">
          <div className="auth-tabs">
            <button
              type="button"
              className={`tab-btn${authView === 'login' ? ' active' : ''}`}
              onClick={() => handleSwitchView('login')}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              className={`tab-btn${authView === 'register' ? ' active' : ''}`}
              onClick={() => handleSwitchView('register')}
            >
              Registrarse
            </button>
          </div>

          <form id="login-form" className={authView === 'login' ? 'active' : ''} onSubmit={handleSubmitLogin}>
            <h2>Iniciar Sesión</h2>
            <input
              type="email"
              id="auth-email"
              placeholder="Correo electrónico"
              value={loginData.correo}
              onChange={(event) => setLoginData(prev => ({ ...prev, correo: event.target.value }))}
              required
            />
            <div className="password-container">
              <input
                type={showLoginPassword ? 'text' : 'password'}
                id="auth-password"
                placeholder="Contraseña"
                value={loginData.contrasena}
                onChange={(event) => setLoginData(prev => ({ ...prev, contrasena: event.target.value }))}
                required
              />
              <button
                type="button"
                className="toggle-password"
                id="toggle-login-password"
                onClick={() => setShowLoginPassword((prev) => !prev)}
              >
                <i className={`fas ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? 'Iniciando...' : 'Entrar'}
            </button>
            {authError && authView === 'login' ? <div id="auth-error" className="error-message">{authError}</div> : null}
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button type="button" className="forgot-password" id="forgot-password-link" onClick={() => handleSwitchView('recover')}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div id="google-signin-button" style={{ marginTop: 15 }}></div>
          </form>

          <form id="register-form" className={authView === 'register' ? 'active' : ''} onSubmit={handleSubmitRegister}>
            <h2>Crear Cuenta</h2>
            <input
              type="text"
              id="reg-name"
              placeholder="Nombre completo"
              value={registerData.nombre}
              onChange={(event) => setRegisterData(prev => ({ ...prev, nombre: event.target.value }))}
              required
            />
            <input
              type="email"
              id="reg-email"
              placeholder="Correo electrónico"
              value={registerData.correo}
              onChange={(event) => setRegisterData(prev => ({ ...prev, correo: event.target.value }))}
              required
            />
            <select
              id="reg-country"
              value={registerData.pais}
              onChange={(event) => setRegisterData(prev => ({ ...prev, pais: event.target.value }))}
              required
            >
              <option value="">Selecciona un país</option>
              <option value="MX">México</option>
              <option value="CO">Colombia</option>
              <option value="AR">Argentina</option>
              <option value="ES">España</option>
              <option value="PE">Perú</option>
              <option value="CL">Chile</option>
              <option value="VE">Venezuela</option>
              <option value="EC">Ecuador</option>
              <option value="BO">Bolivia</option>
              <option value="PY">Paraguay</option>
              <option value="UY">Uruguay</option>
              <option value="US">Estados Unidos</option>
            </select>
            <input
              type="text"
              id="reg-curp-rfc"
              placeholder="CURP o RFC (si eres de México)"
              value={registerData.curpRfc}
              onChange={(event) => setRegisterData(prev => ({ ...prev, curpRfc: event.target.value }))}
            />
            <input
              type="tel"
              id="reg-phone"
              placeholder="Teléfono (opcional)"
              value={registerData.telefono}
              onChange={(event) => setRegisterData(prev => ({ ...prev, telefono: event.target.value }))}
            />
            <div className="password-container">
              <input
                type={showRegisterPassword ? 'text' : 'password'}
                id="reg-password"
                placeholder="Contraseña (mín 6 caracteres)"
                value={registerData.contrasena}
                onChange={(event) => setRegisterData(prev => ({ ...prev, contrasena: event.target.value }))}
                required
              />
              <button
                type="button"
                className="toggle-password"
                id="toggle-register-password"
                onClick={() => setShowRegisterPassword((prev) => !prev)}
              >
                <i className={`fas ${showRegisterPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Cuenta'}
            </button>
            {authError && authView === 'register' ? <div id="reg-error" className="error-message">{authError}</div> : null}
            <div id="google-register-button" style={{ marginTop: 15 }}></div>
          </form>

          <form id="recover-password-form" className={authView === 'recover' ? 'active' : ''} onSubmit={handleSubmitRecover}>
            <h2>Recuperar Contraseña</h2>
            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '15px' }}>
              Ingresa tu correo electrónico para recibir instrucciones de recuperación.
            </p>
            <input
              type="email"
              id="recover-email"
              placeholder="Correo electrónico"
              value={recoverEmail}
              onChange={(event) => setRecoverEmail(event.target.value)}
              required
            />
            <button type="submit" className="btn">Enviar Enlace</button>
            {authError && authView === 'recover' ? <div id="recover-error" className="error-message">{authError}</div> : null}
            <button type="button" className="back-to-login" id="back-to-login" onClick={() => handleSwitchView('login')}>
              Volver a Iniciar Sesión
            </button>
          </form>
        </div>

        <button id="auth-close" className="close-btn" type="button" onClick={() => setIsAuthModalOpen(false)}>
          &times;
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
