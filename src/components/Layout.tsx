import { Outlet, NavLink } from 'react-router-dom';
import { Home, Calendar, PenLine, BookOpen, MessageCircle } from 'lucide-react';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-svh bg-em-cream">
      <main className="flex-1 pb-24 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-em-surface border-t border-em-border px-2 py-2">
        <div className="flex justify-around items-center">
          <NavItem to="/" icon={<Home size={20} />} label="Home" />
          <NavItem to="/calendar" icon={<Calendar size={20} />} label="Calendar" />
          <NavItem to="/log" icon={<PenLine size={20} />} label="Log" />
          <NavItem to="/guide" icon={<BookOpen size={20} />} label="Guide" />
          <NavItem to="/chat" icon={<MessageCircle size={20} />} label="Em" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-colors ${
          isActive ? 'text-em-rose' : 'text-em-muted'
        }`
      }
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}
