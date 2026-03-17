import { Outlet, NavLink } from 'react-router-dom';
import { Home, BookOpen, ChefHat, Compass } from 'lucide-react';

export default function PartnerLayout() {
  return (
    <div className="flex flex-col min-h-svh bg-em-cream">
      <main className="flex-1 pb-24 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-em-surface border-t border-em-border px-2 py-2">
        <div className="flex justify-around items-center">
          <PartnerNavItem to="/partner" icon={<Home size={20} />} label="Today" />
          <PartnerNavItem to="/partner/guide" icon={<BookOpen size={20} />} label="Guide" />
          <PartnerNavItem to="/partner/recipes" icon={<ChefHat size={20} />} label="Recipes" />
          <PartnerNavItem to="/partner/activities" icon={<Compass size={20} />} label="Activities" />
        </div>
      </nav>
    </div>
  );
}

function PartnerNavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/partner'}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-colors ${
          isActive ? 'text-em-lavender' : 'text-em-muted'
        }`
      }
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}
