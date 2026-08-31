import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Building2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const roleHome = {
  admin: "/admin/dashboard",
  manager: "/manager/dashboard",
  tenant: "/tenant/dashboard",
  staff: "/staff/dashboard",
  vendor: "/vendor/dashboard",
  owner: "/tenant/dashboard",
};

const getRoleHome = (user) => roleHome[user?.role?.toLowerCase()] || "/";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get("role");
  const roleLabel = selectedRole ? `${selectedRole} ` : "";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await login(form.email.trim(), form.password);
      navigate(getRoleHome(data.user || data));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.request ? "Server se connection nahi ho pa raha. Backend start karke dobara try karein." : err.message) ||
          "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page auth-page-modern">
      <section className="auth-shell" aria-label="Sign in">
        <div className="auth-art-panel">
          <div className="auth-brand"><span className="auth-brand-mark"><Building2 size={19} /></span> Havenly<span>.</span></div>
          <div className="auth-art-copy">
            <p className="auth-eyebrow">Property operations, simplified</p>
            <h1>Make every space feel <em>looked after.</em></h1>
            <p>One calm place for the people, properties, and details that keep everything moving.</p>
          </div>
          <div className="auth-art-stat"><ShieldCheck size={18} /><span><strong>Trusted workspace</strong><br />Built for better handoffs</span></div>
          <div className="auth-art-grid" aria-hidden="true"><span /><span /><span /><span /></div>
        </div>

        <div className="auth-content-panel">
          <div className="auth-mobile-brand"><span className="auth-brand-mark"><Building2 size={18} /></span> Havenly<span>.</span></div>
          <div className="auth-heading">
            <p className="auth-eyebrow">Welcome back</p>
            <h2>Sign in{roleLabel && ` as ${roleLabel}`}.</h2>
            <p>Pick up where you left off.</p>
          </div>
          {error && <p className="auth-alert error-text" role="alert">{error}</p>}
          <form className="auth-form-modern" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email address</label>
            <div className="auth-input-wrap"><Mail size={18} /><input id="login-email" type="email" name="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required /></div>
            <div className="auth-label-row"><label htmlFor="login-password">Password</label><Link to="/forgot-password">Forgot password?</Link></div>
            <div className="auth-input-wrap"><LockKeyhole size={18} /><input id="login-password" type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required /><button className="auth-icon-button" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? "Signing in..." : "Sign in"}<ArrowRight size={18} /></button>
          </form>
          <p className="auth-switch">New to Havenly? <Link to={`/register${selectedRole ? `?role=${selectedRole}` : ""}`}>Create an account</Link></p>
          <Link className="auth-back-link" to="/select-role">Use a different role</Link>
        </div>
      </section>
    </main>
  );
};

export default Login;
