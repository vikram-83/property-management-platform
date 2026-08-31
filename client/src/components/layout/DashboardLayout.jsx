import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import Footer from "../layout/Footer";
import PageDropdownNav from "../common/PageDropdownNav";
import { useAuth } from "../../context/AuthContext";

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || "manager";

  return (
    <div className={`dashboard-layout dashboard-layout-${role} min-h-screen flex flex-col`}>
      
      <Navbar />

      <div className="dashboard-body flex-1 flex">
        
        <Sidebar role={role} />

        <main className="dashboard-content flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50 overflow-y-auto">
          <PageDropdownNav role={role} />
          {children}
        </main>

      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;