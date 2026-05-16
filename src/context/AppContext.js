'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [loginData, setLoginData] = useState({ correo: '', contrasena: '' });
  const [registerData, setRegisterData] = useState({ nombre: '', correo: '', contrasena: '' });
  const [recoverEmail, setRecoverEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    // Load from local storage on mount
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const addToCart = (product, size, quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      let newCart;
      if (existing) {
        newCart = prev.map(item => 
          item.id === product.id && item.size === size 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prev, { ...product, size, quantity }];
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, size) => {
    setCart(prev => {
      const newCart = prev.filter(item => !(item.id === id && item.size === size));
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (id, size, delta) => {
    setCart(prev => {
      const newCart = prev.map(item => {
        if (item.id === id && item.size === size) {
          const newQ = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQ };
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const login = async (userData) => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      // Use NextAuth signIn
      const result = await signIn('credentials', {
        redirect: false,
        email: userData.correo,
        password: userData.contrasena
      });

      if (result?.error) {
        setAuthError(result.error === 'CredentialsSignin' ? 'Credenciales inválidas' : 'Error al iniciar sesión');
      } else {
        // We will let NextAuth handle the session, but we can also set the local user
        const localUser = { email: userData.correo, name: userData.correo.split('@')[0] };
        setUser(localUser);
        localStorage.setItem('user', JSON.stringify(localUser));
        setIsAuthModalOpen(false);
        setLoginData({ correo: '', contrasena: '' });
      }
    } catch (error) {
      setAuthError('Error de conexión. Inténtalo de nuevo.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setAuthError('');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.nombre,
          email: userData.correo,
          password: userData.contrasena,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Log them in immediately via next-auth
        const result = await signIn('credentials', {
          redirect: false,
          email: userData.correo,
          password: userData.contrasena
        });
        
        if (!result?.error) {
          const localUser = data.user || { email: userData.correo, name: userData.nombre };
          setUser(localUser);
          localStorage.setItem('user', JSON.stringify(localUser));
          setIsAuthModalOpen(false);
        } else {
          setAuthView('login');
          setAuthError('Cuenta creada. Inicia sesión manualmente.');
        }
        setRegisterData({ nombre: '', correo: '', contrasena: '' });
      } else {
        setAuthError(data.error || 'Error al crear la cuenta');
      }
    } catch (error) {
      setAuthError('Error de conexión. Inténtalo de nuevo.');
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    await signOut({ redirect: false });
  };

  return (
    <SessionProvider>
      <AppContext.Provider value={{
        cart, addToCart, removeFromCart, updateQuantity,
        isCartOpen, setIsCartOpen,
        user, setUser, login, register, logout,
        isAuthModalOpen, setIsAuthModalOpen,
        authView, setAuthView,
        loginData, setLoginData,
        registerData, setRegisterData,
        recoverEmail, setRecoverEmail,
        authError, setAuthError,
        isLoading,
        language, setLanguage,
      }}>
        <SessionSync />
        {children}
      </AppContext.Provider>
    </SessionProvider>
  );
}

// Small component to sync NextAuth session with our custom user state
function SessionSync() {
  const { data: session } = useSession();
  const { setUser } = useAppContext();
  
  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      localStorage.setItem('user', JSON.stringify(session.user));
    }
  }, [session, setUser]);
  
  return null;
}

export function useAppContext() {
  return useContext(AppContext);
}
