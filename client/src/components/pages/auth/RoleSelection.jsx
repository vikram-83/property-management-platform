import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Building2, ClipboardCheck, Home, KeyRound, UsersRound } from "lucide-react";

const roles = [
  {
    value: "manager",
    title: "Property manager",
    description: "Manage properties, tenants, leases, maintenance, and payments.",
    icon: Building2,
  },
  {
    value: "vendor",
    title: "Vendor",
    description: "Receive maintenance work, manage jobs, and submit invoices.",
    icon: BriefcaseBusiness,
  },
  {
    value: "tenant",
    title: "Tenant",
    description: "View your home, rent, lease, documents, and support requests.",
    icon: Home,
  },
  {
    value: "staff",
    title: "Staff member",
    description: "Handle assigned maintenance tasks and your work schedule.",
    icon: ClipboardCheck,
  },
  {
    value: "owner",
    title: "Property owner",
    description: "Stay informed about your property and its activity.",
    icon: KeyRound,
  },
];

const RoleSelection = () => {
  return (
    <main className="auth-page role-selection-page role-selection-modern">
      <section className="role-selection" aria-labelledby="role-selection-title">
        <header className="role-selection-header">
          <div className="auth-brand"><span className="auth-brand-mark"><Building2 size={19} /></span> Havenly<span>.</span></div>
          <span className="role-step"><span>01</span> of 01</span>
        </header>
        <div className="auth-intro role-selection-intro">
          <p className="auth-kicker">Your workspace starts here</p>
          <h1 id="role-selection-title">What’s your place<br /><em>in the picture?</em></h1>
          <p>Choose a workspace to see the tools and access designed around your day.</p>
        </div>

        <div className="role-grid role-grid-modern">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return <article className="role-card role-card-modern" key={role.value}>
              <div className="role-card-top"><span className="role-number">0{index + 1}</span><span className="role-icon"><Icon size={21} /></span></div>
              <div><h2>{role.title}</h2><p>{role.description}</p></div>
              <div className="role-actions role-actions-modern">
                <Link to={`/register?role=${role.value}`} className="role-primary-action">Join workspace <ArrowRight size={16} /></Link>
                <Link to={`/login?role=${role.value}`} className="role-secondary-action">Sign in</Link>
              </div>
            </article>;
          })}
        </div>
        <p className="role-selection-footer"><UsersRound size={15} /> You can change your role later from your profile.</p>
      </section>
    </main>
  );
};

export default RoleSelection;
