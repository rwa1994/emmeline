import { Link } from 'react-router-dom';

function PhaseRing() {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.45;
  const offset = circumference - progress * circumference;

  return (
    <div className="relative w-36 h-36">
      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#EDD5D7" strokeWidth="7" />
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="#C49A9E"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-light text-em-text">12</span>
        <span className="text-xs text-em-muted">day 12</span>
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 260 }}>
      <div
        className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-em-text/10"
        style={{ backgroundColor: '#FDF8F3', minHeight: 480 }}
      >
        {/* Status bar */}
        <div className="flex justify-between items-center px-6 pt-4 pb-1">
          <span className="text-[10px] font-medium text-em-muted">9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-1 h-1 rounded-full bg-em-muted" />
            <div className="w-1 h-1 rounded-full bg-em-muted" />
            <div className="w-1 h-1 rounded-full bg-em-muted" />
          </div>
        </div>
        {children}
      </div>
      {/* Reflection */}
      <div
        className="absolute inset-0 rounded-[40px] pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)' }}
      />
    </div>
  );
}

function HerMockup() {
  return (
    <PhoneFrame>
      <div className="px-5 pt-3 pb-6">
        <p className="text-em-muted text-xs">Good morning</p>
        <h2 className="font-heading text-2xl text-em-text mt-0.5 mb-5">Emma</h2>

        <div className="flex flex-col items-center mb-5">
          <PhaseRing />
          <div className="mt-3 text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#D4E8D1', color: '#5E8057' }}>
              Follicular phase
            </span>
            <p className="text-em-muted text-xs mt-1">16 days until next period</p>
          </div>
        </div>

        <div className="rounded-2xl p-4 mb-3" style={{ backgroundColor: '#D4E8D1' }}>
          <p className="text-xs text-em-text leading-relaxed">Oestrogen is rising. Energy and creativity are building.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-2xl p-3.5 border border-em-border">
            <div className="w-6 h-6 rounded-lg bg-em-rose-light flex items-center justify-center mb-2">
              <div className="w-3 h-3 rounded bg-em-rose" />
            </div>
            <p className="text-xs font-medium text-em-text">Log today</p>
            <p className="text-[10px] text-em-muted mt-0.5">How are you feeling?</p>
          </div>
          <div className="rounded-2xl p-3.5" style={{ backgroundColor: '#D4E8D1' }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: '#5E8057' }}>
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <p className="text-xs font-medium text-em-text">Ask Em</p>
            <p className="text-[10px] text-em-muted mt-0.5">Chat, advice, support</p>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function PartnerMockup() {
  return (
    <PhoneFrame>
      <div className="px-5 pt-3 pb-6">
        <p className="text-em-muted text-xs">Good morning</p>
        <h2 className="font-heading text-2xl text-em-text mt-0.5 mb-5">James</h2>

        <div className="rounded-2xl p-4 mb-3" style={{ backgroundColor: '#D4E8D1' }}>
          <p className="text-xs font-medium text-em-text mb-1">Follicular phase</p>
          <p className="text-xs leading-relaxed" style={{ color: '#5E8057' }}>She is full of energy right now. A great time for plans together.</p>
        </div>

        <p className="text-[10px] font-medium text-em-muted uppercase tracking-widest mb-2">How to help today</p>
        <div className="space-y-2">
          {['Plan something exciting together', 'Match her energy', 'Suggest a new experience'].map((tip, i) => (
            <div key={i} className="bg-white rounded-xl px-3 py-2.5 border border-em-border flex items-center justify-between">
              <p className="text-xs text-em-text leading-relaxed">{tip}</p>
              <div className="w-3.5 h-3.5 flex-shrink-0 ml-2" style={{ color: '#5E8057' }}>✦</div>
            </div>
          ))}
        </div>

        <p className="text-[10px] font-medium text-em-muted uppercase tracking-widest mb-2 mt-4">Activities</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-xl p-2.5 border border-em-border">
            <p className="text-xs font-medium text-em-text">Farmers market</p>
            <p className="text-[10px] text-em-muted mt-0.5">She will love this right now</p>
          </div>
          <div className="bg-white rounded-xl p-2.5 border border-em-border">
            <p className="text-xs font-medium text-em-text">Try somewhere new</p>
            <p className="text-[10px] text-em-muted mt-0.5">New experiences land well</p>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function FeatureCard({ color, bg, title, description }: { color: string; bg: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: bg }}>
      <p className="font-heading text-lg text-em-text mb-1">{title}</p>
      <p className="text-sm text-em-muted leading-relaxed">{description}</p>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-svh bg-em-cream" style={{ maxWidth: '100%' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 pt-8 pb-4 max-w-5xl mx-auto">
        <span className="font-heading text-2xl text-em-text">Emmeline</span>
        <Link to="/login" className="text-sm font-medium text-em-muted hover:text-em-text transition-colors">
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-10 pb-14 text-center max-w-lg mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-6" style={{ backgroundColor: '#EDD5D7', color: '#9E6F73' }}>
          Now in beta
        </div>
        <h1 className="font-heading text-5xl text-em-text leading-tight mb-5">
          For her.<br />For the both of you.
        </h1>
        <p className="text-em-muted text-lg leading-relaxed mb-8">
          Emmeline helps women understand their cycle and feel supported — and gives their partner the knowledge to actually show up.
        </p>
        <Link
          to="/signup"
          className="inline-block w-full max-w-xs py-4 rounded-2xl bg-em-rose text-white font-medium text-base text-center mb-3"
        >
          Get started
        </Link>
        <p className="text-em-muted text-sm">Free during beta. No card required.</p>
      </section>

      {/* Phone mockups */}
      <section className="pb-16 overflow-hidden">
        <div className="flex gap-5 px-6 justify-center flex-wrap">
          <div>
            <p className="text-center text-xs font-medium text-em-muted uppercase tracking-widest mb-4">Her view</p>
            <HerMockup />
          </div>
          <div>
            <p className="text-center text-xs font-medium text-em-muted uppercase tracking-widest mb-4">Partner view</p>
            <PartnerMockup />
          </div>
        </div>
      </section>

      {/* Her features */}
      <section className="px-6 pb-14 max-w-lg mx-auto">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-2">For her</p>
        <h2 className="font-heading text-3xl text-em-text mb-6">Know your body better</h2>
        <div className="space-y-3">
          <FeatureCard
            color="#C49A9E" bg="#EDD5D7"
            title="Cycle tracking"
            description="Log your symptoms, mood, and energy daily. See patterns emerge across your cycle."
          />
          <FeatureCard
            color="#5E8057" bg="#D4E8D1"
            title="Phase guide"
            description="Nutrition, exercise, and mental health advice tailored to each phase of your cycle."
          />
          <FeatureCard
            color="#7A6FA8" bg="#DDD9EE"
            title="Em — your AI companion"
            description="Chat with Em about anything cycle-related. Warm, private, and always available."
          />
          <FeatureCard
            color="#C47A84" bg="#FAE8EB"
            title="GP report"
            description="Generate a structured health summary from your logs to share with your doctor."
          />
        </div>
      </section>

      {/* Partner features */}
      <section className="px-6 pb-14 max-w-lg mx-auto">
        <p className="text-xs font-medium text-em-muted uppercase tracking-widest mb-2">For her partner</p>
        <h2 className="font-heading text-3xl text-em-text mb-6">Stop guessing. Start helping.</h2>
        <div className="space-y-3">
          <FeatureCard
            color="#C49A9E" bg="#EDD5D7"
            title="Daily guide"
            description="Know exactly where she is in her cycle and what she needs today — without having to ask."
          />
          <FeatureCard
            color="#5E8057" bg="#D4E8D1"
            title="AI-powered suggestions"
            description="Tap any suggestion to get a personalised plan based on her phase and your shared interests."
          />
          <FeatureCard
            color="#7A6FA8" bg="#DDD9EE"
            title="What to say. What to avoid."
            description="Practical guidance on how to communicate and what not to do at each phase."
          />
        </div>
      </section>

      {/* Quote */}
      <section className="px-6 pb-14 max-w-lg mx-auto">
        <div className="rounded-3xl p-7" style={{ backgroundColor: '#EDD5D7' }}>
          <p className="font-heading text-xl text-em-text leading-relaxed mb-4">
            "I always wanted to be more supportive but genuinely did not know how. Emmeline changed that."
          </p>
          <p className="text-sm text-em-muted">Beta tester, Melbourne</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-20 text-center max-w-lg mx-auto">
        <h2 className="font-heading text-4xl text-em-text mb-4">Ready to try it?</h2>
        <p className="text-em-muted mb-8">Takes two minutes to set up. Works on any phone.</p>
        <Link
          to="/signup"
          className="inline-block w-full max-w-xs py-4 rounded-2xl bg-em-rose text-white font-medium text-base text-center mb-4"
        >
          Create your account
        </Link>
        <p className="text-em-muted text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-em-rose font-medium">Sign in</Link>
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-em-border px-6 py-6 text-center">
        <p className="text-xs text-em-muted">Emmeline · Built with care · Beta</p>
      </footer>

    </div>
  );
}
