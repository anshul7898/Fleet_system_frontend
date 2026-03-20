import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signIn,
  confirmSignIn,
  signOut,
  getCurrentUser,
} from 'aws-amplify/auth';

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [requiresNewPassword, setRequiresNewPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      background: '#ffffff',
      fontFamily:
        'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    },
    card: {
      width: '100%',
      maxWidth: 420,
      padding: 20,
      border: '1px solid #E6E8EE',
      borderRadius: 12,
      background: '#FFFFFF',
      boxShadow: '0 8px 24px rgba(20, 21, 28, 0.08)',
    },
    title: {
      margin: '0 0 14px',
      fontSize: 20,
      fontWeight: 800,
      color: '#14151C',
    },
    field: { marginBottom: 12, textAlign: 'left' },
    label: {
      display: 'block',
      marginBottom: 6,
      fontSize: 13,
      fontWeight: 700,
      color: '#4D5165',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #DFE2E7',
      borderRadius: 10,
      outline: 'none',
      fontSize: 14,
      color: '#14151C',
      background: '#FFFFFF',
      boxSizing: 'border-box',
    },
    error: {
      margin: '10px 0 12px',
      padding: '10px 12px',
      border: '1px solid #FFD6D6',
      background: '#FFF5F5',
      color: '#B42318',
      borderRadius: 10,
      fontSize: 13,
      textAlign: 'left',
    },
    button: {
      width: '100%',
      border: 'none',
      borderRadius: 10,
      padding: '10px 12px',
      background: '#16A34A',
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 800,
      cursor: 'pointer',
    },
    buttonSecondary: {
      width: '100%',
      border: '1px solid #DFE2E7',
      borderRadius: 10,
      padding: '10px 12px',
      background: '#FFFFFF',
      color: '#14151C',
      fontSize: 14,
      fontWeight: 800,
      cursor: 'pointer',
      marginTop: 10,
    },
    buttonDisabled: { opacity: 0.6, cursor: 'not-allowed' },
    hint: {
      marginTop: 12,
      fontSize: 12,
      color: '#667085',
      textAlign: 'center',
    },
  };

  const persistLogin = () => {
    sessionStorage.setItem('isLoggedIn', 'true');
  };

  const redirectAfterLogin = () => {
    persistLogin();
    navigate('/RidersComponent', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const u = username.trim();
      const p = password;

      if (!u) throw new Error('Username is required.');
      if (!p) throw new Error('Password is required.');

      // Check if user is already signed in, sign them out first
      let currentUser = null;
      try {
        currentUser = await getCurrentUser();
      } catch (err) {
        // no user, ignore
      }
      if (currentUser) {
        await signOut();
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      const result = await signIn({ username: u, password: p });
      const step = result?.nextStep?.signInStep;

      if (step === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setRequiresNewPassword(true);
        setNewPassword('');
        return;
      }

      if (step && step !== 'DONE') {
        throw new Error(
          `Additional sign-in step required: ${step}. (MFA/OTP not implemented.)`,
        );
      }

      redirectAfterLogin();
    } catch (err) {
      setError(err?.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (!newPassword) throw new Error('New password is required.');

      const result = await confirmSignIn({ challengeResponse: newPassword });
      const step = result?.nextStep?.signInStep;

      if (step && step !== 'DONE') {
        throw new Error(
          `Additional sign-in step required: ${step}. (MFA/OTP not implemented.)`,
        );
      }

      setRequiresNewPassword(false);
      setNewPassword('');
      redirectAfterLogin();
    } catch (err) {
      setError(err?.message || 'Failed to set new password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    setRequiresNewPassword(false);
    setNewPassword('');
    setError('');
  };

  return (
    <div style={styles.page}>
      <form
        onSubmit={requiresNewPassword ? handleSetNewPassword : handleSubmit}
        style={styles.card}
      >
        <h2 style={styles.title}>
          {requiresNewPassword ? 'Set New Password' : 'Login'}
        </h2>

        {!requiresNewPassword ? (
          <>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="username">
                Username / Email
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                placeholder="Enter username or email"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Enter password"
                required
              />
            </div>
          </>
        ) : (
          <>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
                placeholder="Enter a new password"
                required
              />
            </div>

            <div style={styles.hint}>
              Your account requires a password change on first login.
            </div>
          </>
        )}

        {error ? <div style={styles.error}>{error}</div> : null}

        <button
          type="submit"
          disabled={submitting}
          style={{
            ...styles.button,
            ...(submitting ? styles.buttonDisabled : null),
          }}
        >
          {submitting
            ? requiresNewPassword
              ? 'Saving...'
              : 'Signing in...'
            : requiresNewPassword
              ? 'Set Password & Continue'
              : 'Sign in'}
        </button>

        {requiresNewPassword ? (
          <button
            type="button"
            onClick={handleBackToLogin}
            disabled={submitting}
            style={{
              ...styles.buttonSecondary,
              ...(submitting ? styles.buttonDisabled : null),
            }}
          >
            Back
          </button>
        ) : null}
      </form>
    </div>
  );
}
