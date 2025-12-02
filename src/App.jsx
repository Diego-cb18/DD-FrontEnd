import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import Reports from './Reports';
import Comments from './Comments';
import Graph from './Graph';
import MenuGeneral from './components/MenuGeneral';

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div className="min-h-screen bg-[#C4C4C4] flex justify-center items-center">Cargando...</div>;
  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <>
                <MenuGeneral />
                <Reports />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/coments"
          element={
            <ProtectedRoute>
              <>
                <MenuGeneral />
                <Comments />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/graph"
          element={
            <ProtectedRoute>
              <>
                <MenuGeneral />
                <Graph />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
