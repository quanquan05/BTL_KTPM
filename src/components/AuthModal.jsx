import React, { useState } from 'react';
import { X, LogIn, UserPlus, AlertCircle, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useApp();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    setError('');
    const res = login(email, password);
    if (!res.success) {
      setError(res.error);
    } else {
      onClose();
    }
  };

  const handleSubmitRegister = (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không trùng khớp.');
      return;
    }
    const res = register(name, email, password);
    if (!res.success) {
      setError(res.error);
    } else {
      onClose();
    }
  };

  const fillQuickAccount = (role) => {
    setError('');
    if (role === 'user') {
      setEmail('user@demo.com');
      setPassword('password123');
    } else {
      setEmail('admin@gamerent.vn');
      setPassword('admin123');
    }
  };

  return (
    <div className="modal-overlay" id="modal-auth-overlay" data-testid="auth-modal">
      <div className="modal-card">
        {/* Header Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: '#FAFAFA' }}>
          <button
            type="button"
            id="tab-auth-login"
            onClick={() => { setTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '14px',
              background: tab === 'login' ? 'var(--primary-light)' : 'transparent',
              border: 'none',
              borderBottom: tab === 'login' ? '2px solid var(--primary)' : 'none',
              color: tab === 'login' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.94rem',
              cursor: 'pointer'
            }}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            id="tab-auth-register"
            onClick={() => { setTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '14px',
              background: tab === 'register' ? 'var(--primary-light)' : 'transparent',
              border: 'none',
              borderBottom: tab === 'register' ? '2px solid var(--primary)' : 'none',
              color: tab === 'register' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.94rem',
              cursor: 'pointer'
            }}
          >
            Tạo Tài Khoản
          </button>
          <button
            type="button"
            onClick={onClose}
            id="btn-close-auth-modal"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '0 16px', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div
              id="auth-error-alert"
              data-testid="auth-error-alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'var(--accent-red-bg)',
                border: '1px solid var(--accent-red-border)',
                color: '#DC2626',
                fontSize: '0.85rem',
                marginBottom: 14
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleSubmitLogin}>
              {/* Điền nhanh tài khoản test */}
              <div style={{ marginBottom: 14, background: 'var(--bg-surface)', padding: 10, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: 6 }}>
                  Phím tắt tài khoản kiểm thử:
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    id="btn-quick-fill-user"
                    onClick={() => fillQuickAccount('user')}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '6px 8px', fontSize: '0.78rem' }}
                  >
                    Điền Acc: <strong>Khách Thuê</strong>
                  </button>
                  <button
                    type="button"
                    id="btn-quick-fill-admin"
                    onClick={() => fillQuickAccount('admin')}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '6px 8px', fontSize: '0.78rem' }}
                  >
                    <Shield size={12} /> Điền Acc: <strong>Admin</strong>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-login-email">
                  Địa chỉ Email:
                </label>
                <input
                  type="email"
                  id="input-login-email"
                  data-testid="input-login-email"
                  className="form-input"
                  placeholder="user@demo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-login-password">
                  Mật khẩu:
                </label>
                <input
                  type="password"
                  id="input-login-password"
                  data-testid="input-login-password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                id="btn-submit-login"
                data-testid="btn-submit-login"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 10, padding: '10px' }}
              >
                <LogIn size={16} /> Đăng Nhập
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitRegister}>
              <div className="form-group">
                <label className="form-label" htmlFor="input-reg-name">
                  Họ và tên hiển thị:
                </label>
                <input
                  type="text"
                  id="input-reg-name"
                  data-testid="input-reg-name"
                  className="form-input"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-reg-email">
                  Địa chỉ Email:
                </label>
                <input
                  type="email"
                  id="input-reg-email"
                  data-testid="input-reg-email"
                  className="form-input"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-reg-password">
                  Mật khẩu (tối thiểu 6 ký tự):
                </label>
                <input
                  type="password"
                  id="input-reg-password"
                  data-testid="input-reg-password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-reg-confirm-password">
                  Nhập lại mật khẩu:
                </label>
                <input
                  type="password"
                  id="input-reg-confirm-password"
                  data-testid="input-reg-confirm-password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                id="btn-submit-register"
                data-testid="btn-submit-register"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 10, padding: '10px' }}
              >
                <UserPlus size={16} /> Hoàn Tất Đăng Ký (Nhận 50k Test)
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
