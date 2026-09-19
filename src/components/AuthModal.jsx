import React, { useState } from 'react';
import { X, LogIn, UserPlus, AlertCircle, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { users, login, register } = useApp();
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
      const renter = users?.find(u => u.role === 'renter');
      if (renter) {
        setEmail(renter.email);
        setPassword(renter.password || '123456');
      } else {
        setError('Chưa có tài khoản khách nào. Vui lòng chuyển sang tab "Đăng Ký" để tạo tài khoản mới!');
      }
    } else {
      setEmail('admin@gamerent.vn');
      setPassword('admin123');
    }
  };

  return (
    <div className="modal-overlay" id="modal-auth-overlay" data-testid="auth-modal">
      <div className="modal-card" style={{ maxWidth: 440 }}>
        {/* Header Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: '#FFFFFF', position: 'relative' }}>
          <button
            type="button"
            id="tab-auth-login"
            onClick={() => { setTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '14px',
              background: 'transparent',
              border: 'none',
              borderBottom: tab === 'login' ? '2px solid var(--primary)' : '2px solid transparent',
              color: tab === 'login' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
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
              background: 'transparent',
              border: 'none',
              borderBottom: tab === 'register' ? '2px solid var(--primary)' : '2px solid transparent',
              color: tab === 'register' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            Đăng Ký
          </button>
          <button
            type="button"
            onClick={onClose}
            id="btn-close-auth-modal"
            style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px 24px' }}>
          {error && (
            <div
              id="auth-error-alert"
              data-testid="auth-error-alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 8,
                background: 'var(--accent-red-bg)',
                border: '1px solid var(--accent-red-border)',
                color: 'var(--accent-red-text)',
                fontSize: '0.82rem',
                marginBottom: 14
              }}
            >
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleSubmitLogin}>
              {/* Điền nhanh tài khoản test */}
              <div style={{ marginBottom: 14, background: 'var(--bg-surface)', padding: 10, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  Điền nhanh tài khoản mẫu:
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    id="btn-quick-fill-user"
                    onClick={() => fillQuickAccount('user')}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '5px 8px', fontSize: '0.76rem' }}
                  >
                    Acc: <strong>Khách Thuê</strong>
                  </button>
                  <button
                    type="button"
                    id="btn-quick-fill-admin"
                    onClick={() => fillQuickAccount('admin')}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '5px 8px', fontSize: '0.76rem' }}
                  >
                    <Shield size={12} /> Acc: <strong>Admin</strong>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="input-login-email" style={{ fontSize: '0.82rem' }}>
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  id="input-login-email"
                  data-testid="input-login-email"
                  className="form-input"
                  placeholder="tester@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 18 }}>
                <label className="form-label" htmlFor="input-login-password" style={{ fontSize: '0.82rem' }}>
                  Mật khẩu
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
                style={{ width: '100%', padding: '10px' }}
              >
                <LogIn size={15} /> Đăng Nhập
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitRegister}>
              <div className="form-group">
                <label className="form-label" htmlFor="input-reg-name" style={{ fontSize: '0.82rem' }}>
                  Họ và tên
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
                <label className="form-label" htmlFor="input-reg-email" style={{ fontSize: '0.82rem' }}>
                  Địa chỉ Email
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
                <label className="form-label" htmlFor="input-reg-password" style={{ fontSize: '0.82rem' }}>
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="input-reg-password"
                  data-testid="input-reg-password"
                  className="form-input"
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 18 }}>
                <label className="form-label" htmlFor="input-reg-confirm-password" style={{ fontSize: '0.82rem' }}>
                  Nhập lại mật khẩu
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
                style={{ width: '100%', padding: '10px' }}
              >
                <UserPlus size={15} /> Tạo Tài Khoản (Nhận 100k Ví)
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
