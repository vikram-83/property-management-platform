import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Building2, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get("role");
  const roles = ["manager", "tenant", "staff", "vendor", "owner"];
  const initialRole = roles.includes(selectedRole) ? selectedRole : "tenant";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: initialRole,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register({
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
      });
      navigate(`/login?role=${form.role}&registered=1`);
      } catch (err) {
  setError(
    err.response?.data?.message ||
    (err.request ? "Server se connection nahi ho pa raha. Backend start karke dobara try karein." : err.message) ||
    "Registration failed"
  );
}
    finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page auth-page-modern auth-register-page">
      <section className="auth-shell" aria-label="Create account">
        <div className="auth-art-panel auth-art-panel-register">
          <div className="auth-brand"><span className="auth-brand-mark"><Building2 size={19} /></span> Havenly<span>.</span></div>
          <div className="auth-art-copy"><p className="auth-eyebrow">A better way to belong</p><h1>Build your place in the <em>story.</em></h1><p>Join a connected workspace where every role has a clear view and a voice.</p></div>
          <div className="auth-role-note"><span>01</span><div><strong>{form.role[0].toUpperCase() + form.role.slice(1)} workspace</strong><br />You can change this anytime</div></div>
        </div>
        <div className="auth-content-panel">
          <div className="auth-mobile-brand"><span className="auth-brand-mark"><Building2 size={18} /></span> Havenly<span>.</span></div>
          <div className="auth-heading"><p className="auth-eyebrow">Start here</p><h2>Create your account.</h2><p>A few details and you’re in.</p></div>
          {error && <p className="auth-alert error-text" role="alert">{error}</p>}
          <form className="auth-form-modern" onSubmit={handleSubmit}>
            <label htmlFor="register-name">Full name</label>
            <div className="auth-input-wrap"><UserRound size={18} /><input id="register-name" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required /></div>
            <label htmlFor="register-email">Email address</label>
            <div className="auth-input-wrap"><Mail size={18} /><input id="register-email" type="email" name="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required /></div>
            <div className="auth-two-fields"><div><label htmlFor="register-phone">Phone <span>(optional)</span></label><div className="auth-input-wrap"><Phone size={18} /><input id="register-phone" name="phone" placeholder="+91 00000 00000" value={form.phone} onChange={handleChange} /></div></div><div><label htmlFor="register-role">I am a</label><select id="register-role" name="role" value={form.role} onChange={handleChange}><option value="manager">Manager</option><option value="tenant">Tenant</option><option value="staff">Staff</option><option value="vendor">Vendor</option><option value="owner">Owner</option></select></div></div>
            <label htmlFor="register-password">Create password</label>
            <div className="auth-input-wrap"><LockKeyhole size={18} /><input id="register-password" type={showPassword ? "text" : "password"} name="password" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required minLength={6} /><button className="auth-icon-button" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create account"}<ArrowRight size={18} /></button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
          <Link className="auth-back-link" to="/select-role">Choose a different role</Link>
        </div>
      </section>
    </main>
  );
};

export default Register;
