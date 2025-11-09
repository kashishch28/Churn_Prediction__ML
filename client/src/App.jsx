import React, { useState, useEffect } from 'react';

const STYLES = `
:root { 
  --sidebar-width: 280px; 
  --header-height: 80px; 
  --primary: #6366F1; 
  --primary-dark: #4F46E5; 
  --primary-light: #818cf8;
  --bg-body: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --bg-card: rgba(255, 255, 255, 0.95);
  --bg-sidebar: linear-gradient(180deg, #1E1E2D 0%, #2D2B42 100%);
  --text-main: #111827; 
  --text-muted: #6B7280; 
  --danger: #EF4444; 
  --success: #10B981; 
  --warning: #F59E0B;
  --shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 25px 50px rgba(0, 0, 0, 0.15);
  --glow: 0 0 40px rgba(99, 102, 241, 0.15);
}

* { 
  margin: 0; 
  padding: 0; 
  box-sizing: border-box; 
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
}

body { 
  background: var(--bg-body); 
  color: var(--text-main); 
  height: 100vh; 
  overflow: hidden;
}

.dashboard-layout { 
  display: grid; 
  grid-template-areas: "sidebar header" "sidebar main"; 
  grid-template-columns: var(--sidebar-width) 1fr; 
  grid-template-rows: var(--header-height) 1fr; 
  height: 100vh;
  background: var(--bg-body);
  position: relative;
}

/* Animated Background for Main Section */
.dashboard-layout::before {
  content: '';
  position: absolute;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  animation: float 6s ease-in-out infinite;
  pointer-events: none;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(0.5deg); }
}

/* Enhanced Sidebar */
.sidebar { 
  grid-area: sidebar; 
  background: var(--bg-sidebar); 
  color: #9FA6BC; 
  display: flex; 
  flex-direction: column; 
  padding: 25px 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  z-index: 2;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent);
}

.logo { 
  color: white; 
  font-weight: 800; 
  font-size: 1.6rem; 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  margin-bottom: 40px; 
  padding: 0 10px;
  background: linear-gradient(135deg, #fff 0%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo::before {
  content: '⚡';
  font-size: 1.8rem;
  filter: drop-shadow(0 0 10px rgba(129, 140, 248, 0.5));
}

.nav-menu { 
  list-style: none; 
  flex-grow: 1; 
}

.nav-item { 
  padding: 15px 18px; 
  margin-bottom: 8px; 
  border-radius: 12px; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  gap: 14px; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
  transition: left 0.5s ease;
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item:hover, .nav-item.active { 
  background: rgba(99, 102, 241, 0.15); 
  color: white; 
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(99, 102, 241, 0.2);
}

.nav-item.active {
  background: rgba(99, 102, 241, 0.25);
  border-left: 3px solid var(--primary);
}

.sidebar-footer { 
  font-size: 0.8rem; 
  text-align: center; 
  opacity: 0.6; 
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Enhanced Header */
.header { 
  grid-area: header; 
  background: rgba(255, 255, 255, 0.85); 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 0 35px; 
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  backdrop-filter: blur(15px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 2;
}

.page-title { 
  font-size: 1.4rem; 
  font-weight: 700;
  background: linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-profile { 
  display: flex; 
  align-items: center; 
  gap: 15px; 
  font-weight: 600;
  color: var(--text-main);
}

.avatar { 
  width: 42px; 
  height: 42px; 
  background: var(--primary); 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-hover);
}

/* Enhanced Main Content */
.main-content { 
  grid-area: main; 
  padding: 35px; 
  overflow-y: auto; 
  display: flex; 
  flex-direction: column; 
  gap: 35px;
  position: relative;
  z-index: 1;
}

/* Floating particles background */
.main-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 90% 60%, rgba(139, 92, 246, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 40% 80%, rgba(79, 70, 229, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 70% 30%, rgba(129, 140, 248, 0.1) 0%, transparent 20%);
  animation: particleMove 20s linear infinite;
  pointer-events: none;
  z-index: -1;
}

@keyframes particleMove {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(-5px, 5px) rotate(1deg); }
  50% { transform: translate(5px, -5px) rotate(-1deg); }
  75% { transform: translate(-3px, -3px) rotate(0.5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

/* Enhanced Metrics Grid */
.metrics-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
  gap: 25px; 
}

.metric-card { 
  background: var(--bg-card); 
  padding: 30px; 
  border-radius: 20px; 
  border: 1px solid rgba(229, 231, 235, 0.8);
  display: flex; 
  flex-direction: column;
  box-shadow: var(--shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--primary-light));
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}

.metric-title { 
  font-size: 0.85rem; 
  color: var(--text-muted); 
  font-weight: 600; 
  text-transform: uppercase; 
  letter-spacing: 0.8px;
  margin-bottom: 8px;
}

.metric-value { 
  font-size: 2.8rem; 
  font-weight: 900; 
  margin: 5px 0; 
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content-grid { 
  display: grid; 
  grid-template-columns: 2fr 1fr; 
  gap: 30px; 
  align-items: start; 
}

/* Enhanced Panels */
.panel { 
  background: var(--bg-card); 
  border-radius: 20px; 
  border: 1px solid rgba(229, 231, 235, 0.8);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
}

.panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
}

.panel:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.panel-header { 
  padding: 25px 30px; 
  border-bottom: 1px solid rgba(243, 244, 246, 0.8);
  font-weight: 700; 
  font-size: 1.2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-body { 
  padding: 30px; 
}

.selector-wrap { 
  margin-bottom: 30px; 
}

.selector-wrap select { 
  width: 100%; 
  padding: 15px; 
  border: 2px solid #E5E7EB; 
  border-radius: 12px; 
  font-size: 1rem; 
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 15px center;
  background-repeat: no-repeat;
  background-size: 1.5em;
  padding-right: 50px;
}

.selector-wrap select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.form-layout { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 25px; 
}

.input-group label { 
  display: block; 
  font-size: 0.9rem; 
  font-weight: 600; 
  color: var(--text-muted); 
  margin-bottom: 10px;
}

.input-group input, .input-group select { 
  width: 100%; 
  padding: 14px; 
  border: 2px solid #E5E7EB; 
  border-radius: 10px; 
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
}

.input-group input:focus, .input-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

/* Enhanced Button */
.btn-primary { 
  grid-column: 1 / -1; 
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white; 
  border: none; 
  padding: 18px; 
  border-radius: 12px; 
  font-weight: 700; 
  font-size: 1.1rem; 
  cursor: pointer; 
  margin-top: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover { 
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled { 
  opacity: 0.6; 
  cursor: not-allowed;
  transform: none !important;
}

/* Enhanced Results */
.result-display { 
  text-align: center; 
  padding: 30px 0; 
}

.churn-safe { 
  color: var(--success);
  font-weight: 800;
}

.churn-risk { 
  color: var(--danger);
  font-weight: 800;
}

.risk-bar-container { 
  height: 28px; 
  background: #F3F4F6; 
  border-radius: 14px; 
  margin: 25px 0; 
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.risk-bar-fill { 
  height: 100%; 
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.risk-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.feature-item { 
  margin-bottom: 20px; 
  padding: 15px;
  background: rgba(249, 250, 251, 0.8);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(243, 244, 246, 0.9);
  transform: translateX(5px);
}

.feature-info { 
  display: flex; 
  justify-content: space-between; 
  font-size: 0.95rem; 
  margin-bottom: 8px; 
  font-weight: 600; 
}

.feature-progress { 
  height: 10px; 
  background: #F3F4F6; 
  border-radius: 5px; 
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.feature-progress-bar { 
  height: 100%; 
  background: linear-gradient(90deg, var(--primary), var(--primary-light));
  transition: width 1s ease-out;
  border-radius: 5px;
}

/* Enhanced Error Screen */
.full-screen-error { 
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%; 
  background: var(--bg-sidebar); 
  color: white; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  flex-direction: column; 
  z-index: 999;
  text-align: center;
  padding: 40px;
}

.full-screen-error h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fff 0%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.full-screen-error p {
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 30px;
  max-width: 500px;
  line-height: 1.6;
}

.full-screen-error code {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
  font-family: 'Monaco', 'Consolas', monospace;
  margin: 10px 0;
}

/* Loading Animation */
.loading-dots {
  display: inline-flex;
  gap: 4px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
  animation: bounce 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Responsive */
@media (max-width: 1024px) { 
  .dashboard-layout { 
    grid-template-columns: 1fr; 
    grid-template-areas: "header" "main"; 
  } 
  .sidebar { 
    display: none; 
  } 
  .content-grid { 
    grid-template-columns: 1fr; 
  }
  .dashboard-layout::before {
    left: 0;
  }
}

/* Pulse animation for metrics */
@keyframes pulse-glow {
  0%, 100% { box-shadow: var(--shadow); }
  50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.3); }
}

.metric-card.loading {
  animation: pulse-glow 2s infinite;
}
`;

const API = "http://127.0.0.1:5000";

export default function App() {
  const [metrics, setMetrics] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fatalError, setFatalError] = useState(false);
  const [form, setForm] = useState({
    SeniorCitizen: "0", Partner: "No", Dependents: "No", tenure: 24, InternetService: "Fiber optic",
    Contract: "Month-to-month", PaperlessBilling: "Yes", PaymentMethod: "Electronic check",
    MonthlyCharges: 85.0, TotalCharges: 2040.0
  });

  const safeFetch = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) { return null; }
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const [m, c] = await Promise.all([safeFetch(`${API}/api/analytics`), safeFetch(`${API}/api/customers`)]);
      if (!isMounted) return;
      if (m && !m.error) setMetrics(m);
      if (c && Array.isArray(c)) setCustomers(c);
      if (!m && !c) setFatalError(true);
    };
    init();
    return () => { isMounted = false; };
  }, []);

  const loadCustomer = async (e) => {
    const id = e.target.value; setSelectedId(id); if (!id) return;
    const data = await safeFetch(`${API}/api/customer/${id}`);
    if (data && !data.error) {
      setForm({
        SeniorCitizen: String(data.SeniorCitizen), Partner: data.Partner, Dependents: data.Dependents,
        tenure: data.tenure, InternetService: data.InternetService, Contract: data.Contract,
        PaperlessBilling: data.PaperlessBilling, PaymentMethod: data.PaymentMethod,
        MonthlyCharges: data.MonthlyCharges, TotalCharges: data.TotalCharges
      });
      setResult(null);
    } else { alert("Failed to load customer data."); }
  };

  const runAnalysis = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch(`${API}/predict`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch (err) { alert("Prediction failed. Is backend running?"); }
    setLoading(false);
  };

  if (fatalError) return (
    <div className="full-screen-error">
      <style>{STYLES}</style>
      <h1>🔌 Backend Disconnected</h1>
      <p>React cannot reach Flask at <code>{API}</code>. Please run <code>python app.py</code> in <code>server/</code>.</p>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <style>{STYLES}</style>
      <aside className="sidebar">
        <div className="logo">TelcoAI</div>
        <ul className="nav-menu">
          <li className="nav-item active">📊 Dashboard</li>
          <li className="nav-item">📁 Customers</li>
          <li className="nav-item">⚙️ Settings</li>
        </ul>
        <div className="sidebar-footer">v1.0.0 • Telco Analytics</div>
      </aside>
      <header className="header">
        <div className="page-title">Retention Overview</div>
        <div className="user-profile">
          <span>Admin User</span>
          <div className="avatar">AU</div>
        </div>
      </header>
      <main className="main-content">
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-title">Model Accuracy</span>
            <div className="metric-value">
              {metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : '--'}
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-title">F1 Score</span>
            <div className="metric-value" style={{background: 'linear-gradient(135deg, var(--success) 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              {metrics ? metrics.f1_score.toFixed(3) : '--'}
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-title">Customers Analyzed</span>
            <div className="metric-value" style={{background: 'linear-gradient(135deg, var(--warning) 0%, #d97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              {metrics ? metrics.samples_tested.toLocaleString() : '--'}
            </div>
          </div>
        </div>
        <div className="content-grid">
          <section className="panel">
            <div className="panel-header">🔬 Run Live Analysis</div>
            <div className="panel-body">
              <div className="selector-wrap">
                <label style={{display:'block',marginBottom:'12px',fontWeight:600}}>🔎 Select Customer:</label>
                <select value={selectedId} onChange={loadCustomer} disabled={customers.length===0}>
                  <option value="">{customers.length>0?"-- Choose ID --":"Loading Database..."}</option>
                  {customers.map(id=><option key={id} value={id}>{id}</option>)}
                </select>
              </div>
              <form onSubmit={runAnalysis} className="form-layout">
                {['tenure','MonthlyCharges','TotalCharges'].map(f=>
                  <div className="input-group" key={f}>
                    <label>{f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                    <input type="number" step="0.01" required value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}/>
                  </div>
                )}
                {[
                  {k:'InternetService',o:['Fiber optic','DSL','No']},
                  {k:'Contract',o:['Month-to-month','One year','Two year']},
                  {k:'PaymentMethod',o:['Electronic check','Mailed check','Bank transfer (automatic)','Credit card (automatic)']}
                ].map(({k,o})=>
                  <div className="input-group" key={k}>
                    <label>{k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                    <select value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}>
                      {o.map(opt=><option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                )}
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                      <span className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </span>
                      Analyzing...
                    </span>
                  ) : "PREDICT CHURN RISK ✨"}
                </button>
              </form>
            </div>
          </section>
          <div style={{display:'flex',flexDirection:'column',gap:'30px'}}>
            <section className="panel">
              <div className="panel-header">🔮 AI Forecast Result</div>
              <div className="panel-body result-display">
                {!result ? (
                  <div style={{color:'var(--text-muted)',padding:'50px 0',fontStyle:'italic',fontSize:'1.1rem'}}>
                    Select customer & run analysis
                  </div>
                ) : (
                  <>
                    <h2 className={result.churn_prediction==='Yes'?'churn-risk':'churn-safe'} style={{fontSize:'2.2rem',marginBottom:'15px'}}>
                      {result.churn_prediction==='Yes'?'High Churn Risk ⚠️':'Low Risk Customer ✅'}
                    </h2>
                    <div className="risk-bar-container">
                      <div className="risk-bar-fill" style={{
                        width:`${result.risk_score}%`,
                        background: result.churn_prediction==='Yes' 
                          ? 'linear-gradient(90deg, var(--danger), #dc2626)' 
                          : 'linear-gradient(90deg, var(--success), #059669)'
                      }}/>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',fontWeight:700,fontSize:'1.1rem'}}>
                      <span>Probability:</span>
                      <span>{result.risk_score}%</span>
                    </div>
                  </>
                )}
              </div>
            </section>
            <section className="panel">
              <div className="panel-header">📊 Top Risk Factors</div>
              <div className="panel-body">
                {metrics?.top_features ? (
                  metrics.top_features.map((f,i)=>(
                    <div className="feature-item" key={i}>
                      <div className="feature-info">
                        <span>{f.name.replace(/(Contract_|InternetService_)/,'').replace(/_/g, ' ')}</span>
                        <span>{(f.score*100).toFixed(1)}% Impact</span>
                      </div>
                      <div className="feature-progress">
                        <div className="feature-progress-bar" style={{width:`${(f.score/metrics.top_features[0].score)*100}%`}}/>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{color:'var(--text-muted)',textAlign:'center',padding:'30px 0'}}>
                    <div className="loading-dots" style={{justifyContent: 'center', marginBottom: '10px'}}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    Loading insights...
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}