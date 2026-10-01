import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  AlertCircle,
  Shield,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialTab = 'login',
  pendingRental = null
}) => {
  const { users, login, register } = useApp();
  const [tab, setTab] = useState(initialTab || 'login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setTab(initialTab || 'login');
      setError('');
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    setError('');
    const res = login(email, password);
    if (!res.success) {
      setError(res.error);
    } else {
      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }
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
      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }
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

  const isLogin = tab === 'login';

  return (
    <div
      className={typeof window !== 'undefined' && window.location.search.includes('clean=1') ? "modal-clean-capture" : "modal-overlay"}
      id="modal-auth-overlay"
      data-testid="auth-modal"
      style={typeof window !== 'undefined' && window.location.search.includes('clean=1') ? {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        overflow: 'hidden'
      } : {}}
    >
      <div className="modal-card" style={{ maxWidth: 440, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', border: '1px solid #E2E8F0' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, lineHeight: 1.25 }}>
                {isLogin ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Tài Khoản'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', display: 'block', marginTop: 2 }}>
                {isLogin
                  ? 'Chào mừng bạn quay trở lại với GameRent'
                  : 'Tặng ngay 50.000 đ trải nghiệm vào ví'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="btn-close-auth-modal"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-subtle)',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = '#F1F5F9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-subtle)'; e.currentTarget.style.background = 'none'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '20px 24px' }}>
          {/* Segmented Switcher */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              padding: 4,
              borderRadius: 10,
              display: 'flex',
              gap: 4,
              marginBottom: 18
            }}
          >
            <button
              type="button"
              id="tab-auth-login"
              onClick={() => { setTab('login'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                borderRadius: 8,
                background: isLogin ? '#FFFFFF' : 'transparent',
                color: isLogin ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isLogin ? 700 : 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: isLogin ? 'var(--shadow-xs)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <LogIn size={15} />
              <span>Đăng Nhập</span>
            </button>
            <button
              type="button"
              id="tab-auth-register"
              onClick={() => { setTab('register'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                borderRadius: 8,
                background: !isLogin ? '#FFFFFF' : 'transparent',
                color: !isLogin ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: !isLogin ? 700 : 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: !isLogin ? 'var(--shadow-xs)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <UserPlus size={15} />
              <span>Đăng Ký</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              id="auth-error-alert"
              data-testid="auth-error-alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 12px',
                borderRadius: 8,
                background: 'var(--accent-red-bg)',
                border: '1px solid var(--accent-red-border)',
                color: 'var(--accent-red-text)',
                fontSize: '0.82rem',
                marginBottom: 16
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {isLogin ? (
            /* =================== FORM ĐĂNG NHẬP =================== */
            <form onSubmit={handleSubmitLogin}>
              {/* Điền nhanh tài khoản test */}
              <div
                style={{
                  marginBottom: 16,
                  background: 'var(--bg-surface)',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Sparkles size={12} color="var(--primary)" /> Điền nhanh tài khoản mẫu:
                  </span>
                  <span
                    style={{
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      padding: '1px 6px',
                      borderRadius: 4
                    }}
                  >
                    BTL TESTER
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    id="btn-quick-fill-user"
                    onClick={() => fillQuickAccount('user')}
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4
                    }}
                  >
                    <User size={13} color="var(--primary)" /> Acc: <strong>Khách Thuê</strong>
                  </button>
                  <button
                    type="button"
                    id="btn-quick-fill-admin"
                    onClick={() => fillQuickAccount('admin')}
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4
                    }}
                  >
                    <Shield size={13} color="var(--primary)" /> Acc: <strong>Admin</strong>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label" htmlFor="input-login-email" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Địa chỉ Email <span style={{ color: 'var(--accent-red)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    color="var(--text-subtle)"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    type="email"
                    id="input-login-email"
                    data-testid="input-login-email"
                    className="form-input"
                    placeholder="tester@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', paddingLeft: 36 }}
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label" htmlFor="input-login-password" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Mật khẩu <span style={{ color: 'var(--accent-red)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    color="var(--text-subtle)"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="input-login-password"
                    data-testid="input-login-password"
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', paddingLeft: 36, paddingRight: 36 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      padding: 2
                    }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-login"
                data-testid="btn-submit-login"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '11px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
              >
                <LogIn size={16} /> Đăng Nhập
              </button>

              {/* Chuyển sang Đăng ký */}
              <div style={{ textAlign: 'center', marginTop: 14, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('register'); setError(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Đăng ký ngay
                </button>
              </div>
            </form>
          ) : (
            /* =================== FORM ĐĂNG KÝ =================== */
            <form onSubmit={handleSubmitRegister}>
              {/* Họ và tên */}
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label" htmlFor="input-reg-name" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Họ và tên <span style={{ color: 'var(--accent-red)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={16}
                    color="var(--text-subtle)"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    type="text"
                    id="input-reg-name"
                    data-testid="input-reg-name"
                    className="form-input"
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: '100%', paddingLeft: 36 }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label" htmlFor="input-reg-email" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Địa chỉ Email <span style={{ color: 'var(--accent-red)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    color="var(--text-subtle)"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    type="email"
                    id="input-reg-email"
                    data-testid="input-reg-email"
                    className="form-input"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', paddingLeft: 36 }}
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label" htmlFor="input-reg-password" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Mật khẩu <span style={{ color: 'var(--accent-red)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    color="var(--text-subtle)"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="input-reg-password"
                    data-testid="input-reg-password"
                    className="form-input"
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', paddingLeft: 36, paddingRight: 36 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      padding: 2
                    }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label" htmlFor="input-reg-confirm-password" style={{ fontSize: '0.82rem', marginBottom: 6, display: 'block' }}>
                  Nhập lại mật khẩu <span style={{ color: 'var(--accent-red)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck
                    size={16}
                    color="var(--text-subtle)"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="input-reg-confirm-password"
                    data-testid="input-reg-confirm-password"
                    className="form-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ width: '100%', paddingLeft: 36, paddingRight: 36 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      padding: 2
                    }}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-register"
                data-testid="btn-submit-register"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '11px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
              >
                <UserPlus size={16} /> Tạo Tài Khoản (Nhận 50k Ví)
              </button>

              {/* Chuyển sang Đăng nhập */}
              <div style={{ textAlign: 'center', marginTop: 14, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('login'); setError(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* Security note */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: 18,
              paddingTop: 12,
              borderTop: '1px dashed var(--border-subtle)',
              fontSize: '0.72rem',
              color: 'var(--text-subtle)'
            }}
          >
            <ShieldCheck size={13} color="var(--primary)" />
            <span>Hệ thống bảo mật dữ liệu 24/7 • GameRent Auto</span>
          </div>
        </div>
      </div>
    </div>
  );
};
