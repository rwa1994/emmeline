import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './screens/auth/Login';
import Signup from './screens/auth/Signup';
import Onboarding from './screens/auth/Onboarding';
import Layout from './components/Layout';
import Dashboard from './screens/her/Dashboard';
import Calendar from './screens/her/Calendar';
import Log from './screens/her/Log';
import PhaseGuide from './screens/her/PhaseGuide';
import Chat from './screens/her/Chat';

function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-svh bg-em-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-em-rose border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route
          path="/onboarding"
          element={user && !profile ? <Onboarding /> : <Navigate to={user ? '/' : '/login'} />}
        />
        <Route
          path="/"
          element={
            !user ? <Navigate to="/login" /> :
            !profile ? <Navigate to="/onboarding" /> :
            <Layout />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="log" element={<Log />} />
          <Route path="guide" element={<PhaseGuide />} />
          <Route path="chat" element={<Chat />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
