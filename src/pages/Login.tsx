import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const { login: setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const bgStyle: CSSProperties = {
    backgroundImage: "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('/bg-coffee.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(identifier, password);
      setAuth(data.token, data.user);
      navigate('/');
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err) {
        setError((err as { message?: string }).message || 'Đăng nhập thất bại');
      } else {
        setError('Đăng nhập thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={bgStyle} className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">Đăng nhập BK Farmers</h1>
        <input
          type="text"
          placeholder="Số điện thoại"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
        />
        {error && <p className="text-red-300 mb-2 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-semibold rounded-lg hover:opacity-90 transition"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        <div className="mt-4 text-center text-sm text-white/80">
          Chưa có tài khoản?{' '}
          <button type="button" onClick={() => navigate('/register')} className="underline font-semibold">
            Đăng ký
          </button>
        </div>
      </form>
    </div>
  );
}
