import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Logo = () => (
  <img src="/modelsuite-talents.png" alt="ModelSuite Talents Logo" className="w-80 h-auto object-contain mx-auto block hover:scale-105 transition-transform duration-300" />
);

const inputCls = 'w-full bg-bg-input border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary outline-none placeholder:text-[#4e4a6e] focus:border-primary focus:ring-[3px] focus:ring-primary/20 transition-all duration-200 font-sans hover:border-border-light';
const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.6px] text-text-muted group-focus-within:text-primary transition-colors duration-200';

const RegisterPage = () => {
  const [step, setStep]       = useState(0);
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]       = useState('Talent');
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const nextStep = () => setStep(s => Math.min(2, s + 1));
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/register', { name, email, password, role });
      login(data);
      data.role === 'Admin' ? navigate('/admin/dashboard') : navigate('/talent/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[480px_1fr]">
      {/* ── Left: Form panel ── */}
      <div className="relative flex flex-col justify-center px-14 py-16 bg-bg-card border-r border-border overflow-hidden sidebar-glow animate-fade-in">
        <div className="mb-6 relative z-10 animate-fade-slide" style={{ filter: 'drop-shadow(0 4px 16px rgba(59,130,246,0.3))', animationDelay: '0.1s', animationFillMode: 'both' }}>
          <Logo id="reg-grad" />
        </div>
        <div className="mb-8 text-center relative z-10 animate-fade-slide" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
          <h1 className="text-[26px] font-bold tracking-tight text-text-primary mb-1.5">Assessment Portal</h1>
          <p className="text-sm text-text-muted">Create your intern account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col relative z-10 animate-fade-slide w-full" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          
          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-border'}`} />
            ))}
          </div>

          {/* Form Steps Container */}
          <div className="overflow-hidden relative w-full">
            <div className="flex transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ transform: `translateX(-${step * 100}%)` }}>
              
              {/* Step 0: Identity */}
              <div className="w-full shrink-0 flex flex-col gap-4 px-1 pb-1">
                <div className="flex flex-col gap-2 group">
                  <label className={labelCls} htmlFor="name">Full Name</label>
                  <input id="name" type="text" placeholder="Jane Doe"
                    value={name} onChange={(e) => setName(e.target.value)} required={step === 0} className={inputCls} />
                </div>
                <div className="flex flex-col gap-2 group">
                  <label className={labelCls} htmlFor="reg-email">Email address</label>
                  <input id="reg-email" type="email" placeholder="you@company.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required={step === 0} className={inputCls} />
                </div>
              </div>

              {/* Step 1: Security */}
              <div className="w-full shrink-0 flex flex-col gap-4 px-1 pb-1">
                <div className="flex flex-col gap-2 group">
                  <label className={labelCls} htmlFor="reg-password">Password</label>
                  <input id="reg-password" type="password" placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)} required={step === 1} className={inputCls} />
                </div>
              </div>

              {/* Step 2: Role */}
              <div className="w-full shrink-0 flex flex-col gap-4 px-1 pb-1">
                <label className={labelCls}>Select your path</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setRole('Talent')} 
                    className={`p-4 rounded-xl border-2 transition-all text-left ${role === 'Talent' ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-border bg-bg-input hover:border-border-light hover:-translate-y-0.5'}`}>
                    <h3 className="font-bold text-text-primary mb-1">Talent</h3>
                    <p className="text-[12px] text-text-muted">Find tasks and showcase skills</p>
                  </button>
                  <button type="button" onClick={() => setRole('Admin')} 
                    className={`p-4 rounded-xl border-2 transition-all text-left ${role === 'Admin' ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-border bg-bg-input hover:border-border-light hover:-translate-y-0.5'}`}>
                    <h3 className="font-bold text-text-primary mb-1">Admin</h3>
                    <p className="text-[12px] text-text-muted">Post tasks and review work</p>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button type="button" onClick={prevStep} className="px-6 py-3.5 rounded-[10px] text-[15px] font-semibold text-text-primary bg-bg-input border border-border hover:border-border-light hover:bg-bg-surface transition-all">
                Back
              </button>
            )}
            {step < 2 ? (
              <button type="button" onClick={nextStep} 
                disabled={step === 0 ? (!name || !email) : !password} 
                className="flex-1 py-3.5 rounded-[10px] text-[15px] font-semibold text-white bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all">
                Continue
              </button>
            ) : (
              <button type="submit"
                className="flex-1 py-3.5 rounded-[10px] text-[15px] font-semibold text-white cursor-pointer btn-gradient border-none hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
                Setup Profile
              </button>
            )}
          </div>
        </form>

        <p className="mt-7 text-sm text-text-muted text-center relative z-10 animate-fade-slide" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
          Profile already configured?{' '}
          <Link to="/login" className="text-primary font-medium hover:text-white hover:underline transition-all duration-200">
            Access portal
          </Link>
        </p>
      </div>

      {/* ── Right: Visual panel ── */}
      <div className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden p-16 animate-fade-in min-h-screen bg-gradient-to-br from-bg-dark via-bg-surface to-black"
        style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        
        {/* Top Right Info Icon */}
        <div className="absolute top-12 right-12 group z-50">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-text-muted hover:text-white hover:bg-white/10 transition-all duration-300 cursor-help">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          
          {/* Tooltip Popup */}
          <div className="absolute right-0 top-14 w-[340px] p-6 rounded-2xl bg-[#0D0D0D]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] opacity-0 translate-y-3 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300">
            <h3 className="text-white font-bold text-[15px] mb-4 font-display">Intern Selection Flow</h3>
            <ol className="flex flex-col gap-4 relative">
              {/* Vertical line */}
              <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-white/10 rounded-full"></div>
              
              <li className="flex items-start gap-4 relative opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-100">
                <div className="w-[20px] h-[20px] rounded-full bg-[#10B981] flex-shrink-0 mt-0.5 border-[3px] border-[#0D0D0D] relative z-10 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse"></div>
                <div>
                  <p className="text-[13px] font-semibold text-white">1. Start Working</p>
                  <p className="text-[12px] text-text-muted mt-1 leading-relaxed">Review your pre-assigned issues and begin development.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 relative opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-200">
                <div className="w-[20px] h-[20px] rounded-full bg-[#3B82F6] flex-shrink-0 mt-0.5 border-[3px] border-[#0D0D0D] relative z-10 shadow-[0_0_12px_rgba(59,130,246,0.5)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div>
                  <p className="text-[13px] font-semibold text-white">2. Resolve & Push</p>
                  <p className="text-[12px] text-text-muted mt-1 leading-relaxed">Fix the issue in code and submit a Pull Request.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 relative opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-300">
                <div className="w-[20px] h-[20px] rounded-full bg-[#8B5CF6] flex-shrink-0 mt-0.5 border-[3px] border-[#0D0D0D] relative z-10 shadow-[0_0_12px_rgba(139,92,246,0.5)] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <div>
                  <p className="text-[13px] font-semibold text-white">3. Core Review</p>
                  <p className="text-[12px] text-text-muted mt-1 leading-relaxed">The core team reviews your PR to make a hiring decision.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="relative z-10 max-w-[440px] w-full">
          <h2 className="text-[42px] font-extrabold leading-[1.15] tracking-tight gradient-text mb-5 animate-slide-left" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            Begin Your<br />Assessment.
          </h2>
          <p className="text-base text-text-muted leading-relaxed mb-12 animate-slide-left" style={{ animationDelay: '0.35s', animationFillMode: 'both' }}>
            Register to access your assigned tasks. Solve issues, submit your PRs, and prove your skills.
          </p>
          <div className="flex gap-10">
            {[{ num: 'Code', label: 'Resolve Issues', delay: '0.4s' }, { num: 'Push', label: 'Submit PRs', delay: '0.45s' }, { num: 'Win', label: 'Get Selected', delay: '0.5s' }]
              .map(({ num, label, delay }) => (
                <div key={label} className="flex flex-col gap-1 animate-fade-slide hover:-translate-y-1 transition-transform duration-300 cursor-default" style={{ animationDelay: delay, animationFillMode: 'both' }}>
                  <span className="text-[28px] font-bold text-text-primary tracking-tight">{num}</span>
                  <span className="text-[11px] text-text-muted uppercase tracking-[0.8px] font-medium">{label}</span>
                </div>
              ))}
          </div>
        </div>
        
        {/* Full-width Marquee Ticker */}
        <div className="absolute bottom-16 left-0 w-full marquee-container animate-fade-slide" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <div className="animate-marquee gap-16">
            {['Production Grade System', 'Scalable Apps', 'Streamline Development', 'Enterprise Security', 'Cloud Native', 'High Performance', 'Production Grade System', 'Scalable Apps', 'Streamline Development', 'Enterprise Security', 'Cloud Native', 'High Performance'].map((word, i) => (
              <span key={i} className="text-[13px] md:text-[15px] font-bold uppercase tracking-[0.25em] text-text-faint/80 whitespace-nowrap">
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
