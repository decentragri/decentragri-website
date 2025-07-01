import { useState } from 'preact/hooks';
// Remove preact-router import since we're using window.location directly
import { useAuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // In a real app, you would validate credentials with your server
    // For this example, we'll simulate a successful login with mock data
    setTimeout(() => {
      // Mock successful login
      login({
        username: email.split('@')[0],
        name: 'Demo Farmer',
        email: email,
        profilePicture: '/assets/img/avatars/default-avatar.png',
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        walletAddress: '0x1234...5678',
        level: 3,
        experience: 2500
      });
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="login-welcome-area">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="login-welcome-wrap">
              <div className="login-welcome-content">
                <h2 className="title">Welcome to Decentragri</h2>
                <p>The platform that's transforming agriculture through decentralized technology.</p>
              </div>
              <div className="welcome-rating">
                <img src="assets/img/icons/three_star.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="signup-form-wrap">
              <h4 className="title">Sign in to access your dashboard</h4>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="form-grp">
                  <label htmlFor="email">Email address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail((e.target as HTMLInputElement).value)} 
                    required 
                  />
                </div>
                <div className="form-grp">
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword((e.target as HTMLInputElement).value)} 
                    required 
                  />
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                </div>
                <div className="form-btn-wrap">
                  <button 
                    type="submit" 
                    className="btn login" 
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                  <button 
                    type="button" 
                    className="btn signup"
                    onClick={() => document.getElementById('signupSection')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6">
            <div className="another-way-signup">
              <h4 className="title">Connect your wallet</h4>
              <p>You can also connect using your crypto wallet.</p>
              <ul className="another-way-list">
                <li><a href="#"><img src="assets/img/icons/signup_icon01.png" alt="" />MetaMask <span>Popular</span></a></li>
                <li><a href="#"><img src="assets/img/icons/signup_icon02.png" alt="" />Coinbase Wallet</a></li>
                <li><a href="#"><img src="assets/img/icons/signup_icon03.png" alt="" />Wallet Connect</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="row mt-5" id="signupSection">
          <div className="col-md-6">
            <div className="signup-form-wrap">
              <h4 className="title">Create an account</h4>
              <form action="#">
                <div className="form-grp">
                  <label htmlFor="fName">First name</label>
                  <input type="text" id="fName" />
                </div>
                <div className="form-grp">
                  <label htmlFor="lName">Last name</label>
                  <input type="text" id="lName" />
                </div>
                <div className="form-grp">
                  <label htmlFor="signupEmail">Email address</label>
                  <input type="email" id="signupEmail" />
                </div>
                <div className="form-grp">
                  <label htmlFor="cPassword">Create Password</label>
                  <input type="password" id="cPassword" />
                </div>
                <div className="form-grp">
                  <label htmlFor="rPassword">Confirm Password</label>
                  <input type="password" id="rPassword" />
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="termsCheck" />
                  <label className="form-check-label" htmlFor="termsCheck">I agree to all terms & conditions</label>
                </div>
                <div className="form-btn-wrap">
                  <button type="submit" className="btn signup">Create Account</button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6">
            <div className="signup-info">
              <h4>Why join Decentragri?</h4>
              <ul className="signup-benefits">
                <li><i className="fas fa-check-circle"></i> Access to farm management tools</li>
                <li><i className="fas fa-check-circle"></i> AI-powered agricultural insights</li>
                <li><i className="fas fa-check-circle"></i> Weather forecasts and alerts</li>
                <li><i className="fas fa-check-circle"></i> Sustainable farming certification</li>
                <li><i className="fas fa-check-circle"></i> Connect with global markets</li>
                <li><i className="fas fa-check-circle"></i> Financial services for farmers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;