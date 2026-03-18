import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './screens/auth/Login';
import Signup from './screens/auth/Signup';
import RoleSelect from './screens/auth/RoleSelect';
import Onboarding from './screens/auth/Onboarding';
import PartnerOnboarding from './screens/auth/PartnerOnboarding';
import JoinInvite from './screens/JoinInvite';
import Layout from './components/Layout';
import PartnerLayout from './components/PartnerLayout';
import Dashboard from './screens/her/Dashboard';
import Calendar from './screens/her/Calendar';
import Log from './screens/her/Log';
import PhaseGuide from './screens/her/PhaseGuide';
import Chat from './screens/her/Chat';
import ImportHistory from './screens/her/ImportHistory';
import PartnerControl from './screens/her/PartnerControl';
import Medications from './screens/her/Medications';
import GPReport from './screens/her/GPReport';
import PartnerDashboard from './screens/partner/Dashboard';
import TodayGuide from './screens/partner/TodayGuide';
import Recipes from './screens/partner/Recipes';
import Activities from './screens/partner/Activities';

function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-svh bg-em-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-em-rose border-t-transparent animate-spin" />
      </div>
    );
  }

  const isPartner = profile?.role === 'partner';

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route path="/join/:code" element={<JoinInvite />} />

        {/* Role selection — after signup, before onboarding */}
        <Route
          path="/role"
          element={user && !profile ? <RoleSelect /> : <Navigate to={user ? '/' : '/login'} />}
        />

        {/* Her onboarding */}
        <Route
          path="/onboarding"
          element={user && !profile ? <Onboarding /> : <Navigate to={user ? '/' : '/login'} />}
        />

        {/* Partner onboarding */}
        <Route
          path="/partner-onboarding"
          element={user && !profile ? <PartnerOnboarding /> : <Navigate to={user ? '/' : '/login'} />}
        />

        {/* Her stream */}
        <Route
          path="/"
          element={
            !user ? <Navigate to="/login" /> :
            !profile ? <Navigate to="/role" /> :
            isPartner ? <Navigate to="/partner" /> :
            <Layout />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="log" element={<Log />} />
          <Route path="guide" element={<PhaseGuide />} />
          <Route path="chat" element={<Chat />} />
          <Route path="history" element={<ImportHistory />} />
          <Route path="partner-control" element={<PartnerControl />} />
          <Route path="medications" element={<Medications />} />
          <Route path="report" element={<GPReport />} />
        </Route>

        {/* Partner stream */}
        <Route
          path="/partner"
          element={
            !user ? <Navigate to="/login" /> :
            !profile ? <Navigate to="/role" /> :
            !isPartner ? <Navigate to="/" /> :
            <PartnerLayout />
          }
        >
          <Route index element={<PartnerDashboard />} />
          <Route path="guide" element={<TodayGuide />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="activities" element={<Activities />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
