import { useNavigate } from 'react-router-dom';
import { Heart, Users } from 'lucide-react';

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh bg-em-cream flex flex-col items-center justify-center px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-5xl text-em-text tracking-wide">emmeline</h1>
        <p className="text-em-muted text-sm mt-2">how are you joining?</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={() => navigate('/onboarding')}
          className="w-full p-5 rounded-3xl bg-em-surface border-2 border-em-rose text-left transition-all hover:bg-em-rose-light"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-em-rose-light flex items-center justify-center flex-shrink-0">
              <Heart size={18} className="text-em-rose-dark" />
            </div>
            <div>
              <p className="font-medium text-em-text">I track my cycle</p>
              <p className="text-sm text-em-muted mt-0.5">Log your cycle, get phase guidance, and chat with Em</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/partner-onboarding')}
          className="w-full p-5 rounded-3xl bg-em-surface border border-em-border text-left transition-all hover:border-em-lavender hover:bg-em-lavender-light"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-em-lavender-light flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-em-lavender-dark" />
            </div>
            <div>
              <p className="font-medium text-em-text">I'm a partner</p>
              <p className="text-sm text-em-muted mt-0.5">Get daily guidance on how to support your partner</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
