import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../firebase';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, username, password);
      navigate('/reports');
    } catch (error) {
      alert('Credenciales incorrectas: ' + error.message);
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     await setPersistence(auth, browserSessionPersistence);
  //     const provider = new GoogleAuthProvider();
  //     await signInWithPopup(auth, provider);
  //     navigate('/reports');
  //   } catch (error) {
  //     alert('Error al iniciar sesión con Google: ' + error.message);
  //   }
  // };

  return (
    <div className="min-h-screen bg-[#C4C4C4] flex justify-center items-center">
      <div className="bg-white/40 rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.4)] p-8 w-full max-w-md mx-4">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={30}
              className="w-full px-4 py-2 border-2 border-black rounded-xl focus:outline-none bg-white/40"
              placeholder="Ingresa tu correo"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={30}
                className="w-full px-4 py-2 border-2 border-black rounded-xl focus:outline-none bg-white/40 pr-12"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <line x1="1" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-700 transition"
          >
            Ingresar
          </button>
        </form>
        {/* <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
          >
            Iniciar con Google
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default Login;
