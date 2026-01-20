import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { laptops } from './products'; 
import './App.css';

// --- 1. NAVIGATION COMPONENT ---
const Navigation = ({ user, onLogout }) => {
  const location = useLocation();
  const hideNavOn = ['/login', '/register'];
  const isAuthPage = hideNavOn.includes(location.pathname);

  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <Link to="/" className="logo">PRICE<span>SCOUT</span></Link>
      </div>
      {!isAuthPage && (
        <div className="nav-center">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
          <NavLink to="/compare">Compare</NavLink>
          <NavLink to="/recent">Activity</NavLink>
          <NavLink to="/about">About</NavLink>
        </div>
      )}
      <div className="nav-right">
        {user ? (
          <div className="user-nav">
            <span className="welcome-text">Hi, {user.name}</span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <div className="auth-nav-btns">
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/register" className="register-btn">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

// --- 2. SECURITY GUARD ---
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// --- 3. LOGIN PAGE ---
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleForgot = () => alert("A password reset link has been sent to your registered email!");

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('registered_user'));
    
    if (storedUser && email === storedUser.email && password === storedUser.password) {
      onLogin({ email, name: storedUser.name });
      navigate('/compare');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Secure Login</h2>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group password-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button type="button" className="forgot-link" onClick={handleForgot}>Forgot Password?</button>
          <button type="submit" className="auth-submit">Sign In</button>
        </form>
        <p className="auth-footer">New here? <Link to="/register">Create Account</Link></p>
      </div>
    </div>
  );
};

// --- 4. REGISTER PAGE ---
const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePassword(formData.password)) {
      setError('Security Alert: Password must contain 8+ characters, an uppercase letter, a number, and a special character.');
      return;
    }
    localStorage.setItem('registered_user', JSON.stringify(formData));
    alert("Registration Successful! You can now log in.");
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Join the Network</h2>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group"><label>Full Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
          <div className="input-group"><label>Email Address</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
          <div className="input-group password-group">
            <label>Create Password</label>
            <div className="password-wrapper">
              <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Abc@123..." required />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button type="submit" className="auth-submit">Register</button>
        </form>
        <p className="auth-footer">Already a member? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

// --- 5. UPDATED LANDING PAGE ---
const LandingPage = () => (
  <div className="content-page landing-hero">
    <div className="hero-content">
      <span className="badge">UPGRADED FOR 2026</span>
      <h1>Buy Tech with <br/>Total Transparency.</h1>
      <p>Compare prices across local and international hardware retailers instantly.</p>
      <div className="hero-btns">
        <Link to="/compare" className="btn-primary">Start Scouting</Link>
        <Link to="/about" className="btn-secondary">How it Works</Link>
      </div>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
function App() {
  const [user, setUser] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLaptop, setSelectedLaptop] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('scout_user');
    const savedRecent = localStorage.getItem('scout_recent');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedRecent) setRecentItems(JSON.parse(savedRecent));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('scout_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('scout_user');
  };

  const fetchComparison = async (laptop) => {
    const updatedRecent = [laptop, ...recentItems.filter(item => item.id !== laptop.id)].slice(0, 4);
    setRecentItems(updatedRecent);
    localStorage.setItem('scout_recent', JSON.stringify(updatedRecent));

    setLoading(true);
    setSelectedLaptop(laptop);
    setShowModal(true);
    setResults([]);

    try {
      const response = await fetch('http://localhost:5000/search-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productQuery: laptop.name })
      });
      const data = await response.json();
      setResults(data);
    } catch (err) { console.error("Scraper unreachable"); }
    setLoading(false);
  };

  return (
    <Router>
      <div className="App">
        <div className="background-blobs"></div>
        <Navigation user={user} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/compare" element={<ProtectedRoute user={user}><ComparePage onSelect={fetchComparison} /></ProtectedRoute>} />
          <Route path="/recent" element={<ProtectedRoute user={user}><RecentPage recentItems={recentItems} /></ProtectedRoute>} />
        </Routes>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
              {loading ? (
                <div className="modal-loading"><div className="spinner"></div><p>Scouting Live Prices...</p></div>
              ) : (
                <div className="modal-content-inner">
                  <h2>{selectedLaptop?.name}</h2>
                  <div className="deals-stack">
                    {results.map((item, i) => (
                      <div key={i} className="deal-row">
                        <div className="store-info"><span className="store-badge">{item.store}</span><h4>{item.title}</h4></div>
                        <div className="pricing-actions"><span className="price-display">{item.price}</span><a href={item.url} target="_blank" rel="noreferrer" className="buy-btn">View Store</a></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

const ComparePage = ({ onSelect }) => {
  const [q, setQ] = useState('');
  const filtered = laptops.filter(l => l.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="main-content">
      <div className="search-container"><div className="search-inner"><input className="search-input" placeholder="Search..." onChange={(e) => setQ(e.target.value)} /></div></div>
      <div className="laptop-grid">{filtered.map(l => (
        <div key={l.id} className="laptop-card" onClick={() => onSelect(l)}>
          <div className="card-image-wrapper"><img src={l.image} alt={l.name} onError={(e) => {e.target.src = 'https://via.placeholder.com/300x200'}} /></div>
          <div className="card-body"><h3>{l.name}</h3><button className="compare-trigger">Scout →</button></div>
        </div>
      ))}</div>
    </div>
  );
};

const RecentPage = ({ recentItems }) => (
  <div className="content-page"><h2>Activity History</h2><div className="laptop-grid">{recentItems.map((l, i) => (
    <div key={i} className="laptop-card"><div className="card-image-wrapper"><img src={l.image} alt={l.name} /></div><div className="card-body"><h3>{l.name}</h3></div></div>
  ))}</div></div>
);

const AboutPage = () => <div className="content-page"><h2>About</h2><p>Price Scout is a high-speed data aggregation tool for hardware prices.</p></div>;

export default App;