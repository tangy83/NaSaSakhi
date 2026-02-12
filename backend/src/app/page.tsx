// NASA Sakhi - Homepage
// This is a minimal page to verify frontend is working

export default function HomePage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        🌟 NASA Sakhi
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
        Organization Registration Portal
      </p>

      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          ✅ System Status
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <strong>Frontend:</strong> ✓ Running
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <strong>Next.js:</strong> {process.env.npm_package_dependencies_next || 'Installed'}
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
        }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Test Endpoints:
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a
                href="/api/health"
                style={{ color: '#fff', textDecoration: 'underline' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔍 API Health Check
              </a>
            </li>
            <li>
              <a
                href="/api/db-test"
                style={{ color: '#fff', textDecoration: 'underline' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                🗄️ Database Connection Test
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p style={{ marginTop: '2rem', opacity: 0.8 }}>
        Empowering women and vulnerable children across India
      </p>
    </div>
  );
}
