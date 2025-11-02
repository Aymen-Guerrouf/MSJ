import { useState } from 'react';
import {login} from '../services/api.js'
import {useNavigate} from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await login(email, password )
      console.log(response.user.role);
      
      if (response.user.role == 'admin') {
        navigate('/adminDashboard')
      } else {
        navigate('/superdashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #95D6C2 0%, #4AB0E6 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    card: {
      width: '100%',
      maxWidth: '450px',
      backgroundColor: '#fff',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      overflow: 'hidden',
    },
    header: {
      backgroundColor: '#95D6C2',
      padding: '40px 24px',
      textAlign: 'center',
      color: '#fff',
    },
    iconCircle: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    icon: {
      width: '40px',
      height: '40px',
      fill: '#95D6C2',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '14px',
      margin: '0',
      opacity: '0.9',
    },
    formContainer: {
      padding: '32px',
    },
    errorBox: {
      marginBottom: '16px',
      padding: '12px',
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      color: '#c33',
      borderRadius: '8px',
      fontSize: '14px',
    },
    inputGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '8px',
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    inputIcon: {
      position: 'absolute',
      left: '12px',
      width: '20px',
      height: '20px',
      fill: '#95D6C2',
      pointerEvents: 'none',
    },
    input: {
      width: '100%',
      padding: '12px 12px 12px 44px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
    },
    inputPassword: {
      width: '100%',
      padding: '12px 44px 12px 44px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
    },
    toggleButton: {
      position: 'absolute',
      right: '12px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
    },
    toggleIcon: {
      width: '20px',
      height: '20px',
      fill: '#666',
    },
    rememberRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      color: '#333',
      cursor: 'pointer',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      marginRight: '8px',
      cursor: 'pointer',
      accentColor: '#95D6C2',
    },
    link: {
      fontSize: '14px',
      color: '#95D6C2',
      textDecoration: 'none',
      fontWeight: '500',
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#95D6C2',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(149, 214, 194, 0.3)',
      transition: 'all 0.2s ease',
      marginBottom: '16px',
    },
    signupText: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#666',
      margin: '0',
    },
    signupLink: {
      color: '#95D6C2',
      fontWeight: '600',
      textDecoration: 'none',
    },
    footer: {
      borderTop: '1px solid #e0e0e0',
      padding: '16px 24px',
      textAlign: 'center',
    },
    footerText: {
      fontSize: '12px',
      color: '#999',
      margin: '0',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <svg style={styles.icon} viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <h1 style={styles.title}>Bienvenue</h1>
          <p style={styles.subtitle}>Centre Jeunesse - Espace Directeur</p>
        </div>

        {/* Form */}
        <div style={styles.formContainer}>
          {error && (
            <div style={styles.errorBox}>{error}</div>
          )}

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Adresse Email</label>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votreemail@exemple.dz"
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#95D6C2'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de Passe</label>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                style={styles.inputPassword}
                onFocus={(e) => e.target.style.borderColor = '#95D6C2'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleButton}
              >
                {showPassword ? (
                  <svg style={styles.toggleIcon} viewBox="0 0 24 24">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                  </svg>
                ) : (
                  <svg style={styles.toggleIcon} viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={styles.rememberRow}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              Se souvenir de moi
            </label>
            <a href="#" style={styles.link}>Mot de passe oublié?</a>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            style={styles.button}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#7bc4b0';
              e.target.style.boxShadow = '0 6px 16px rgba(149, 214, 194, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#95D6C2';
              e.target.style.boxShadow = '0 4px 12px rgba(149, 214, 194, 0.3)';
            }}
          >
            Se Connecter
          </button>

          {/* Sign Up Link */}
          <p style={styles.signupText}>
            Vous n'avez pas de compte?{' '}
            <a href="#" style={styles.signupLink}>Contactez l'administrateur</a>
          </p>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>© 2024 Centre Jeunesse. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}