import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Home, BookOpen, ChefHat, Compass, Menu, X, Settings } from 'lucide-react';

export default function PartnerLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-svh bg-em-cream">
      {/* Hamburger button */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-4 right-4 z-40 w-10 h-10 bg-em-surface border border-em-border rounded-2xl flex items-center justify-center shadow-sm"
      >
        <Menu size={18} className="text-em-muted" />
      </button>

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

      {/* Menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMenuOpen(false)} />
          <div className="relative bg-em-surface rounded-t-3xl px-6 pt-5 pb-10 space-y-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-em-muted uppercase tracking-widest">More</p>
              <button onClick={() => setMenuOpen(false)}>
                <X size={18} className="text-em-muted" />
              </button>
            </div>
            <MenuItem to="/partner/settings" icon={<Settings size={18} />} label="Settings" description="Update your details and sign out" onClick={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ to, icon, label, description, onClick }: { to: string; icon: React.ReactNode; label: string; description: string; onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-em-cream border border-em-border">
      <div className="w-9 h-9 rounded-xl bg-em-surface border border-em-border flex items-center justify-center flex-shrink-0 text-em-muted">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-em-text">{label}</p>
        <p className="text-xs text-em-muted mt-0.5">{description}</p>
      </div>
    </Link>
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
