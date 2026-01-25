'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call the login API - credentials will be sent as form data
      const response = await authApi.login(email, password);

      // Extract access_token and user_id from response
      const { access_token, user_id } = response.data;

      if (!access_token) {
        throw new Error('Access token not found in response');
      }

      // Save access_token and user_id to localStorage
      localStorage.setItem('access_token', access_token);
      if (user_id) {
        localStorage.setItem('user_id', user_id.toString());
      }

      // Navigate to dashboard immediately after successful login
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Login error:', err);

      // Ensure error state is always a string to prevent React crashes
      let errorMessage = 'Login failed. Please check your credentials.';

      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          // Handle FastAPI validation errors array
          const firstError = err.response.data.detail[0];
          if (firstError && firstError.msg) {
            errorMessage = firstError.msg;
          } else {
            errorMessage = 'Validation failed. Please check your input.';
          }
        } else {
          errorMessage = 'Login validation failed. Please check your credentials.';
        }
      } else if (err.message) {
        errorMessage = typeof err.message === 'string' ? err.message : 'An error occurred during login.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
    padding: '1rem' // p-4
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '28rem', // max-w-md
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // bg-white/10
    backdropFilter: 'blur(24px)', // backdrop-blur-xl
    borderRadius: '1.5rem', // rounded-3xl
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
    border: '1px solid rgba(255, 255, 255, 0.2)', // border border-white/20
    padding: '3rem' // p-12
  };

  const headerStyle = {
    textAlign: 'center' as const,
    marginBottom: '2.5rem' // mb-10
  };

  const logoStyle = {
    width: '5rem', // w-20
    height: '5rem', // h-20
    background: 'linear-gradient(to right, #7c3aed, #9333ea)', // bg-gradient-to-r from-violet-600 to-purple-600
    borderRadius: '1rem', // rounded-2xl
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem', // mx-auto mb-6
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
    border: '1px solid rgba(255, 255, 255, 0.3)' // border border-white/30
  };

  const headingStyle = {
    fontSize: '2.25rem', // text-4xl
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '0.75rem' // mb-3
  };

  const subHeadingStyle = {
    color: 'rgba(255, 255, 255, 0.8)', // text-white/80
    fontSize: '1.125rem' // text-lg
  };

  const errorStyle = {
    marginBottom: '1.5rem', // mb-6
    padding: '1rem', // p-4
    backgroundColor: 'rgba(239, 68, 68, 0.2)', // bg-red-500/20
    border: '1px solid rgba(239, 68, 68, 0.3)', // border border-red-500/30
    borderRadius: '0.75rem', // rounded-xl
    color: '#fecaca', // text-red-200
    fontSize: '0.875rem', // text-sm
    textAlign: 'center' as const,
    backdropFilter: 'blur(12px)' // backdrop-blur-sm
  };

  const formGroupStyle = {
    marginBottom: '1.5rem' // space-y-6 (but applied to individual groups)
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem', // text-sm
    fontWeight: '600', // font-semibold
    color: 'rgba(255, 255, 255, 0.8)', // text-white/80
    marginBottom: '0.75rem' // mb-3
  };

  const inputStyle = {
    width: '100%',
    padding: '1.25rem', // px-5 py-4 (horizontal padding 5, vertical 4)
    borderRadius: '1rem', // rounded-2xl
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // bg-white/20
    backdropFilter: 'blur(12px)', // backdrop-blur-md
    color: 'white',
    fontSize: '1rem', // text-base
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
    border: '1px solid rgba(255, 255, 255, 0.3)', // border border-white/30
    transition: 'all 0.3s ease', // transition-all duration-300
    boxSizing: 'border-box' as const
  };

  const passwordInputStyle = {
    ...inputStyle,
    color: 'black'
  };

  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #7c3aed, #9333ea)', // bg-gradient-to-r from-violet-600 to-purple-600
    color: 'white',
    fontWeight: '600', // font-semibold
    padding: '1rem 1.5rem', // py-4 px-6
    borderRadius: '1rem', // rounded-2xl
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease', // transition-all duration-300
    transform: 'scale(1)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const footerStyle = {
    marginTop: '2rem', // mt-8
    textAlign: 'center' as const,
    fontSize: '0.875rem', // text-sm
    color: 'rgba(255, 255, 255, 0.7)' // text-white/70
  };

  const linkStyle = {
    fontWeight: '600', // font-semibold
    color: 'white',
    textDecoration: 'none',
    transition: 'color 0.3s ease' // transition-colors
  };

  return (
    <div style={containerStyle}>
      <div style={{width: '100%', maxWidth: '28rem'}}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div style={logoStyle}>
              <span style={{color: 'white', fontSize: '1.875rem', fontWeight: 'bold'}}>T</span>
            </div>
            <h2 style={headingStyle}>Welcome Back</h2>
            <p style={subHeadingStyle}>Login to manage your tasks</p>
          </div>

          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}> {/* space-y-6 */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 4px rgba(139, 92, 246, 0.3)'; // focus:ring-4 focus:ring-violet-500/30 focus:shadow-xl
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // focus:bg-white/90
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // shadow-lg
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // bg-white/20
                }}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={passwordInputStyle}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 4px rgba(139, 92, 246, 0.3)'; // focus:ring-4 focus:ring-violet-500/30 focus:shadow-xl
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // focus:bg-white/90
                  e.target.style.color = 'black'; // Ensure text remains black on focus
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // shadow-lg
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // bg-white/20
                  e.target.style.color = 'black'; // Ensure text remains black on blur
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={buttonStyle}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.target as HTMLElement).style.background = 'linear-gradient(to right, #6d28d9, #7e22ce)'; // hover:from-violet-700 hover:to-purple-700
                  (e.target as HTMLElement).style.transform = 'scale(1.02)'; // hover:scale-[1.02]
                  (e.target as HTMLElement).style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)'; // hover:shadow-2xl
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  (e.target as HTMLElement).style.background = 'linear-gradient(to right, #7c3aed, #9333ea)'; // from-violet-600 to-purple-600
                  (e.target as HTMLElement).style.transform = 'scale(1)';
                  (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; // shadow-xl
                }
              }}
            >
              {loading ? (
                <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    marginLeft: '-0.25rem',
                    marginRight: '0.75rem',
                    animation: 'spin 1s linear infinite',
                    opacity: 0.25
                  }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  </svg>
                  <svg style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    opacity: 0.75,
                    position: 'absolute',
                    animation: 'spin 1s linear infinite'
                  }} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p style={footerStyle}>
            New here?{' '}
            <Link href="/signup" style={linkStyle}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}