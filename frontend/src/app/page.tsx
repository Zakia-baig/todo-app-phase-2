'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const gradientStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)'
  };

  const containerStyle = {
    maxWidth: '72rem', // max-w-6xl
    margin: '0 auto', // mx-auto
    padding: '4rem 1rem' // py-16 px-4
  };

  const flexContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    gap: '4rem', // gap-16
    alignItems: 'center'
  };

  const leftContentStyle = {
    width: '100%', // On mobile
    textAlign: 'center' as const,
    maxWidth: '36rem' // lg:max-w-md
  };

  const rightContentStyle = {
    width: '100%' // On mobile
  };

  const headingStyle = {
    fontSize: '3rem', // text-5xl
    fontWeight: 'bold',
    marginBottom: '1.5rem', // mb-6
    lineHeight: 1.25, // leading-tight
    color: 'white'
  };

  const subHeadingStyle = {
    fontSize: '4.5rem', // md:text-7xl
    fontWeight: 'bold',
    marginBottom: '1.5rem', // mb-6
    lineHeight: 1, // leading-tight
    background: 'linear-gradient(to right, #a78bfa, #c084fc, #818cf8)', // bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent'
  };

  const paragraphStyle = {
    fontSize: '1.25rem', // text-xl
    color: 'rgba(255, 255, 255, 0.8)', // text-white/80
    marginBottom: '2.5rem', // mb-10
    maxWidth: '32rem', // max-w-lg
    textAlign: 'center' as const
  };

  const buttonsContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const, // flex-col
    gap: '1rem', // gap-4
    justifyContent: 'center' // justify-center
  };

  const buttonStyle = {
    padding: '1rem 2rem', // px-8 py-4
    background: 'linear-gradient(to right, #7c3aed, #9333ea)', // bg-gradient-to-r from-violet-600 to-purple-600
    color: 'white',
    fontWeight: '600', // font-semibold
    borderRadius: '1rem', // rounded-2xl
    border: 'none',
    textDecoration: 'none',
    transition: 'all 0.3s ease', // transition-all duration-300
    fontSize: '1.125rem', // text-lg
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
    cursor: 'pointer'
  };

  const secondaryButtonStyle = {
    padding: '1rem 2rem', // px-8 py-4
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // bg-white/10
    color: 'white',
    fontWeight: '600', // font-semibold
    borderRadius: '1rem', // rounded-2xl
    border: '1px solid rgba(255, 255, 255, 0.2)', // border border-white/20
    backdropFilter: 'blur(12px)', // backdrop-blur-sm
    textDecoration: 'none',
    transition: 'all 0.3s ease', // transition-all duration-300
    fontSize: '1.125rem', // text-lg
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
    cursor: 'pointer'
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // bg-white/10
    backdropFilter: 'blur(24px)', // backdrop-blur-xl
    borderRadius: '1.5rem', // rounded-3xl
    padding: '2rem', // p-8
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
    border: '1px solid rgba(255, 255, 255, 0.2)', // border border-white/20
    position: 'relative' as const
  };

  const featureItemStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // bg-white/5
    borderRadius: '1rem', // rounded-2xl
    padding: '1.25rem', // p-5
    border: '1px solid rgba(255, 255, 255, 0.1)', // border border-white/10
    transition: 'all 0.3s ease', // transition-all duration-300
    cursor: 'pointer'
  };

  const statsContainerStyle = {
    marginTop: '6rem', // mt-24
    display: 'grid', // grid
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', // grid-cols-1
    gap: '2rem' // gap-8
  };

  const statItemStyle = {
    textAlign: 'center' as const
  };

  const footerStyle = {
    marginTop: '4rem', // mt-16
    textAlign: 'center' as const,
    color: 'rgba(255, 255, 255, 0.6)' // text-white/60
  };

  // Media query for larger screens
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    if (mediaQuery.matches) {
      Object.assign(flexContainerStyle, {
        flexDirection: 'row' as const // lg:flex-row
      });

      Object.assign(leftContentStyle, {
        width: '50%', // lg:w-1/2
        textAlign: 'left' as const // lg:text-left
      });

      Object.assign(rightContentStyle, {
        width: '50%' // lg:w-1/2
      });

      Object.assign(paragraphStyle, {
        textAlign: 'left' as const // lg:text-left
      });

      Object.assign(buttonsContainerStyle, {
        justifyContent: 'flex-start' // lg:justify-start
      });

      Object.assign(statsContainerStyle, {
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' // md:grid-cols-3
      });
    }
  }

  if (isLoading) {
    return (
      <div style={gradientStyle}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              borderTop: '2px solid #8b5cf6', // border-t-2 border-violet-500
              borderBottom: '2px solid #8b5cf6', // border-b-2 border-violet-500
              borderRadius: '9999px', // rounded-full
              animation: 'spin 1s linear infinite'
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div style={gradientStyle}>
      <div style={containerStyle}>
        <div style={flexContainerStyle}>
          {/* Left Content */}
          <div style={leftContentStyle}>
            <h1 style={headingStyle}>
              <span style={subHeadingStyle}>Todo-Mind</span>
              <br />
              <span style={{color: 'white'}}>Stay Organized  Achieve More</span>
            </h1>

            <p style={paragraphStyle}>
              Everything you need to organize tasks and get things done.
              Simple. Intuitive. Built for productivity.

              
            </p>

            <div style={buttonsContainerStyle}>
              <Link
                href="/login"
                style={buttonStyle}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = 'linear-gradient(to right, #6d28d9, #7e22ce)'; // hover:from-violet-700 hover:to-purple-700
                  (e.target as HTMLElement).style.transform = 'scale(1.05)'; // hover:scale-105
                  (e.target as HTMLElement).style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)'; // hover:shadow-2xl
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = 'linear-gradient(to right, #7c3aed, #9333ea)'; // original bg-gradient
                  (e.target as HTMLElement).style.transform = 'scale(1)'; // normal scale
                  (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; // original shadow
                }}
              >
                Get Started
              </Link>

              <Link
                href="/signup"
                style={secondaryButtonStyle}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // hover:bg-white/20
                  (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; // hover:shadow-xl
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // original bg-white/10
                  (e.target as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'; // original shadow
                }}
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Right Content - Features Preview */}
          <div style={rightContentStyle}>
            <div style={{position: 'relative' as const}}>
              {/* Main Card */}
              <div style={cardStyle}>
                <div style={{marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white'}}>Quick Overview</h3>
                  <div
                    style={{
                      width: '0.75rem',
                      height: '0.75rem',
                      backgroundColor: '#10b981', // bg-emerald-400
                      borderRadius: '9999px', // rounded-full
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' // animate-pulse
                    }}
                  ></div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}> {/* space-y-4 */}
                  {/* Feature 1 */}
                  <div style={featureItemStyle}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // hover:bg-white/10
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; // original bg-white/5
                    }}
                  >
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}> {/* flex items-center gap-4 */}
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        background: 'linear-gradient(to right, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2))', // bg-gradient-to-r from-violet-500/20 to-purple-500/20
                        borderRadius: '0.75rem', // rounded-xl
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(12px)', // backdrop-blur-sm
                        border: '1px solid rgba(255, 255, 255, 0.2)' // border border-white/20
                      }}>
                        <svg style={{width: '1.5rem', height: '1.5rem', color: '#c4b5fd'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h4 style={{fontWeight: '600', color: 'white'}}>Task Management</h4>
                        <p style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem'}}>Organize and track your daily tasks efficiently</p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div style={featureItemStyle}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // hover:bg-white/10
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; // original bg-white/5
                    }}
                  >
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}> {/* flex items-center gap-4 */}
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        background: 'linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(34, 197, 94, 0.2))', // bg-gradient-to-r from-emerald-500/20 to-green-500/20
                        borderRadius: '0.75rem', // rounded-xl
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(12px)', // backdrop-blur-sm
                        border: '1px solid rgba(255, 255, 255, 0.2)' // border border-white/20
                      }}>
                        <svg style={{width: '1.5rem', height: '1.5rem', color: '#6ee7b7'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 style={{fontWeight: '600', color: 'white'}}>Progress Tracking</h4>
                        <p style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem'}}>Monitor your productivity and achievements</p>
                      </div>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div style={featureItemStyle}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // hover:bg-white/10
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; // original bg-white/5
                    }}
                  >
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}> {/* flex items-center gap-4 */}
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        background: 'linear-gradient(to right, rgba(245, 158, 11, 0.2), rgba(251, 146, 60, 0.2))', // bg-gradient-to-r from-amber-500/20 to-orange-500/20
                        borderRadius: '0.75rem', // rounded-xl
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(12px)', // backdrop-blur-sm
                        border: '1px solid rgba(255, 255, 255, 0.2)' // border border-white/20
                      }}>
                        <svg style={{width: '1.5rem', height: '1.5rem', color: '#fcd34d'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 style={{fontWeight: '600', color: 'white'}}>Smart Reminders</h4>
                        <p style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem'}}>Never miss important deadlines</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div style={{
                position: 'absolute' as const,
                top: '-1.5rem', // -top-6
                right: '-1.5rem', // -right-6
                width: '6rem', // w-24
                height: '6rem', // h-24
                background: 'linear-gradient(to right, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2))', // bg-gradient-to-r from-violet-500/20 to-purple-500/20
                borderRadius: '9999px', // rounded-full
                filter: 'blur(24px)', // blur-xl
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' // animate-pulse
              }}></div>
              <div style={{
                position: 'absolute' as const,
                bottom: '-1.5rem', // -bottom-6
                left: '-2rem', // -left-6
                width: '8rem', // w-32
                height: '8rem', // h-32
                background: 'linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(34, 197, 94, 0.2))', // bg-gradient-to-r from-emerald-500/20 to-green-500/20
                borderRadius: '9999px', // rounded-full
                filter: 'blur(24px)', // blur-xl
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' // animate-pulse
              }}></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <div style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#c4b5fd', marginBottom: '0.5rem'}}>10K+</div>
            <div style={{color: 'rgba(255, 255, 255, 0.8)'}}>Active Users</div>
          </div>
          <div style={statItemStyle}>
            <div style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#a7f3d0', marginBottom: '0.5rem'}}>99%</div>
            <div style={{color: 'rgba(255, 255, 255, 0.8)'}}>Satisfaction Rate</div>
          </div>
          <div style={statItemStyle}>
            <div style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#fcd34d', marginBottom: '0.5rem'}}>24/7</div>
            <div style={{color: 'rgba(255, 255, 255, 0.8)'}}>Support Available</div>
          </div>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <p>&copy; 2026 Todo-Mind- Designed & Developed by Zakia Baig</p>
        </div>
      </div>
    </div>
  );
}