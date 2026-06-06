import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shell/contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendMagicCode, verifyMagicCode } = useAuth();
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendMagicCode(email);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to send login code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyMagicCode(email, code);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark cyber-grid transition-colors duration-300 px-4">
      
      {/* Ambient background glows */}
      <div className="glow-spot w-[300px] h-[300px] bg-primary/10 top-1/3 left-1/3 dark:bg-primary/5 animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Term Button Back */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] text-primary hover:text-primary/80 transition-colors mb-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 px-2.5 py-1 rounded"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          ESC_TO_HOME
        </button>

        {/* Console Box Card */}
        <div className="glass-panel rounded-xl shadow-2xl p-8 relative overflow-hidden scanline text-left">
          
          {/* Scanning light animation overlay */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-primary/40 animate-[bounce_4s_infinite] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h1 className="text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-white uppercase">
              SYS_ADMIN_ACCESS.sh
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 mb-8 font-body leading-relaxed">
            {step === 1 
              ? 'Provide authorized administrator credentials to request passwordless verification token.' 
              : `Passwordless verification code has been dispatched to ${email}`}
          </p>

          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-mono text-[10px] text-slate-500 dark:text-zinc-500 uppercase tracking-wider">
                  AUTH_EMAIL_CREDENTIAL
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-10 px-4 rounded border border-gray-200 dark:border-white/5 bg-white/40 dark:bg-zinc-950/60 text-xs font-mono placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                  placeholder="em.munubi@gmail.com"
                />
              </div>

              {error && (
                <div className="p-3 rounded bg-red-100 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 font-mono text-[11px]">
                  ERROR: {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-primary text-background-dark font-mono text-xs font-bold rounded hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? 'REQUESTING_TOKEN...' : 'REQUEST_MAGIC_TOKEN.sh'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="code" className="font-mono text-[10px] text-slate-500 dark:text-zinc-500 uppercase tracking-wider text-center">
                  6-DIGIT_OTP_TOKEN
                </label>
                <input
                  id="code"
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim())}
                  required
                  className="w-full h-12 text-center text-xl font-mono tracking-[0.4em] rounded border border-gray-200 dark:border-white/5 bg-white/40 dark:bg-zinc-950/60 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="000000"
                />
              </div>

              {error && (
                <div className="p-3 rounded bg-red-100 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 font-mono text-[11px]">
                  ERROR: {error}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-primary text-background-dark font-mono text-xs font-bold rounded hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? 'VERIFYING...' : 'VERIFY_&_MOUNT_ADMIN.exe'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full h-9 border border-gray-200 dark:border-white/5 text-slate-600 dark:text-gray-400 bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 rounded font-mono text-[10px] transition-colors"
                >
                  RESET_EMAIL_CREDENTIAL
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
