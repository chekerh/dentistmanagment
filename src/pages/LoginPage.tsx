import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/portal'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      navigate(username === 'patient' ? '/portal' : '/dashboard');
    } else {
      setError('Invalid credentials. Try admin/admin or patient/patient');
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[440px] flex flex-col gap-6 bg-surface-dark border border-border-dark rounded-xl shadow-2xl p-8 z-10 mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-4xl">dentistry</span>
          </div>
          <div className="text-center">
            <h2 className="text-white text-2xl font-bold tracking-tight">Staff Portal Login</h2>
            <p className="text-text-secondary text-sm mt-1">Welcome back. Please enter your details.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Username */}
          <label className="flex flex-col gap-2">
            <span className="text-white text-sm font-medium">Username or ID</span>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your staff ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 bg-[#111822] border border-border-dark rounded-lg px-4 pr-10 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-secondary">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
            </div>
          </label>

          {/* Password */}
          <label className="flex flex-col gap-2">
            <span className="text-white text-sm font-medium">Password</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-[#111822] border border-border-dark rounded-lg px-4 pr-10 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </label>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border-dark bg-transparent accent-primary"
              />
              <span className="text-text-secondary text-sm group-hover:text-white transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-primary text-sm font-medium hover:text-blue-400 transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg shadow-lg shadow-primary/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                Signing in...
              </>
            ) : 'Log In'}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 text-xs text-text-secondary">
          <p className="font-medium text-primary mb-1">Demo Credentials</p>
          <p>Admin: <span className="text-white">admin / admin</span></p>
          <p>Patient: <span className="text-white">patient / patient</span></p>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-border-dark">
          <p className="text-text-secondary text-xs">
            Need access? Contact the{' '}
            <a href="#" className="text-white font-medium hover:underline">Clinic Administrator</a>.
          </p>
        </div>
      </div>

      <div className="mt-8 z-10">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest text-center">
          Powered by DentalCare Systems
        </p>
      </div>
    </div>
  );
}
