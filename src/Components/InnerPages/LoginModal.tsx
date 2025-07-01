import React, { useState } from 'react';
import './LoginModal.css';
import { useAuthStore } from '../../context/AuthContext';
import { AuthClient } from '../../client/auth/clientAuth';
import { UserLoginResponse } from '@server/auth.services/auth.interface';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const authClient = new AuthClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    setLoading(true);
    // No need to handle tokens, cookies are set by backend
    const res = await authClient.loginUser({ username, password });

    setLoading(false);
    if (res instanceof Error) {
      setError(res.message);
      return;
    }
    login(res);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close login modal">×</button>
        <div className="modal-logo">
          <img src="assets/img/logo/decentra_logo2.png" alt="Logo" />
        </div>
        <h2 className="modal-title">Login to Your Account</h2>
        <p className="modal-subtitle">Unlock your farm’s secrets and log in to get growing!</p>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="username"
            placeholder="Username"
            value={username}
            onChange={e => setUsername((e.target as HTMLInputElement).value)}
            className="modal-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword((e.target as HTMLInputElement).value)}
            className="modal-input"
            required
          />
          {error && <div className="modal-error">{error}</div>}
          <button type="submit" className="modal-btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div className="standard-blog-content p">
          <span>
            Don’t have an account yet?{' '}
            <button
              type="button"
              className="modal-link"
              onClick={() => {
                window.location.href = '/';
              }}
            >
              Apply for an account
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
