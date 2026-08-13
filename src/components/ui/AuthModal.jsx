import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'register' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (mode === 'register') {
      if (!username.trim() || !email.trim() || !password.trim()) {
        setError('لطفاً تمامی فیلدهای نام کاربری، ایمیل و رمز عبور را وارد نمایید.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('رمز عبور و تکرار آن با یکدیگر مطابقت ندارند.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
        setLoading(false);
        return;
      }

      const res = await register(username, email, password);
      setLoading(false);
      if (res.success) {
        setSuccessMsg('ثبت‌نام با موفقیت انجام شد! در حال ورود به حساب...');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(res.error || 'خطایی در ثبت‌نام رخ داد.');
      }
    } else {
      if (!username.trim() || !password.trim()) {
        setError('لطفاً نام کاربری و رمز عبور را وارد نمایید.');
        setLoading(false);
        return;
      }
      const res = await login(username, password);
      setLoading(false);
      if (res.success) {
        setSuccessMsg('ورود با موفقیت انجام شد!');
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setError(res.error || 'نام کاربری یا رمز عبور اشتباه است.');
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-[0_0_60px_rgba(0,240,255,0.15)] backdrop-blur-2xl overflow-hidden z-10"
        >
          {/* Top Shimmer Glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Close Button */}
          <button 
            onClick={onClose}
            aria-label="Close Auth Modal"
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <i className="fas fa-times text-sm"></i>
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <i className={`fas ${mode === 'register' ? 'fa-user-plus' : 'fa-lock'} text-xl`}></i>
            </div>
            <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
              {mode === 'register' ? 'ثبت‌نام حساب جدید' : 'ورود به حساب کاربری'}
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1 dir-rtl">
              {mode === 'register' ? 'ایجاد دسترسی به آزمایشگاه و مدل‌ها' : 'ورود به داشبورد پژوهش و پلتفرم'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                mode === 'register' 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <i className="fas fa-user-plus mr-1.5"></i> ثبت‌نام کاربر
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                mode === 'login' 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <i className="fas fa-sign-in-alt mr-1.5"></i> ورود به سیستم
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-mono">
              <i className="fas fa-exclamation-circle ml-1.5"></i> {error}
            </motion.div>
          )}
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-mono">
              <i className="fas fa-check-circle ml-1.5"></i> {successMsg}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                نام کاربری (Username)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: hoosha_researcher"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all ltr text-left"
                />
                <i className="fas fa-user absolute left-3.5 top-3 text-xs text-slate-500"></i>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                  آدرس ایمیل (Email Address)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@hoosha.ai"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all ltr text-left"
                  />
                  <i className="fas fa-envelope absolute left-3.5 top-3 text-xs text-slate-500"></i>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                رمز عبور (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all ltr text-left"
                />
                <i className="fas fa-key absolute left-3.5 top-3 text-xs text-slate-500"></i>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                  تکرار رمز عبور (Confirm Password)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all ltr text-left"
                  />
                  <i className="fas fa-shield-alt absolute left-3.5 top-3 text-xs text-slate-500"></i>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-bold text-xs rounded-xl font-mono tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  <span>{mode === 'register' ? 'تکمیل ثبت‌نام و ورود' : 'ورود به حساب'}</span>
                  <i className="fas fa-arrow-left text-xs"></i>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
