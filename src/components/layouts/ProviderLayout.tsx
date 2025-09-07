import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Package,
  ShoppingCart,
  Briefcase,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';

const navigation = [
  { name: 'Dashboard', href: '/service_provider/dashboard', icon: Home },
  { name: 'Products & Orders', href: '/service_provider/product_order', icon: Package },
  { name: 'Services & Orders & Requests', href: '/service_provider/service_order', icon: Bell },

  //{ name: 'Services', href: '/service_provider/service', icon: ShoppingCart },
  { name: 'Jobs', href: '/service_provider/job', icon: Briefcase },
  //{ name: 'Service Request', href: '/service_provider/service_req', icon: Bell },
  { name: 'Chat Request', href: '/service_provider/chat', icon: Bell },
  //{ name: 'Project Orders', href: '/service_provider/project_order', icon: Bell },
  { name: 'Ongoing Projects', href: '/service_provider/OnGoing_projects', icon: Bell },
  { name: 'Job Request', href: '/service_provider/JobRequest', icon: Settings },
  { name: 'Message', href: '/service_provider/MessagePro', icon: Settings },
];

interface ProviderLayoutProps {
  children: React.ReactNode;
}

const ProviderLayout: React.FC<ProviderLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const providerName =
    localStorage.getItem('currentProvider') &&
    JSON.parse(localStorage.getItem('currentProvider')!).providerName;

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    contact_no: "",
    password: "",
    confirmpassword: "",
    role: "",                // "customer" | "service_provider"
    address: "",
    district: "",
    province: "",
    company_name: "",
    business_reg_no: "",
    company_description: "",
    website: ""
  });
  const provinces = [
    { value: "Western", label: "Western" },
    { value: "Central", label: "Central" },
    { value: "Southern", label: "Southern" },
    { value: "Northern", label: "Northern" },
    { value: "Eastern", label: "Eastern" },
    { value: "North Western", label: "North Western" },
    { value: "North Central", label: "North Central" },
    { value: "Uva", label: "Uva" },
    { value: "Sabaragamuwa", label: "Sabaragamuwa" },
  ];

  const districtsByProvince: Record<string, string[]> = {
    Western: ["Colombo", "Gampaha", "Kalutara"],
    Central: ["Kandy", "Matale", "Nuwara Eliya"],
    Southern: ["Galle", "Matara", "Hambantota"],
    Northern: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    Eastern: ["Trincomalee", "Batticaloa", "Ampara"],
    NorthWestern: ["Kurunegala", "Puttalam"],
    NorthCentral: ["Anuradhapura", "Polonnaruwa"],
    Uva: ["Badulla", "Monaragala"],
    Sabaragamuwa: ["Ratnapura", "Kegalle"]
  };
  const handleSaveProfile = () => {
    // Example: Optional basic validation (you can expand this as needed)
    if (
      registerData.name.trim() === "" &&
      registerData.email.trim() === "" &&
      registerData.contact_no.trim() === "" &&
      registerData.password.trim() === "" &&
      registerData.address.trim() === "" &&
      registerData.province === "" &&
      registerData.district === "" &&
      registerData.company_name.trim() === "" &&
      registerData.company_description.trim() === ""
    ) {
      alert("Please edit at least one field before saving.");
      return;
    }

    // TODO: Send updated data to backend here (e.g., via fetch or axios)

    setIsProfileModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-lg border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:static flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/20">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            SolarX Provider
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-white/50 hover:text-gray-900'
                  }`}
              >
                <Icon size={20} className="mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Profile Button with Dropdown */}
        <div className="p-4 border-t border-white/20 relative">
          <div
            className="w-full"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Button size="sm" className="green-600 text-white w-full">
              Hi, {providerName || 'Provider'}
            </Button>
          </div>

          {/* Dropdown panel */}
          {dropdownOpen && (
            <div className="absolute left-4 right-4 mt-2 p-4 bg-white border rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setIsProfileModalOpen(true);
                  setDropdownOpen(false);
                }}
                className="block w-full text-left text-sm text-blue-600 hover:underline"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="block mt-2 w-full text-left text-sm text-red-600 hover:underline"
              >
                <LogOut size={16} className="inline-block mr-1" />
                Logout
              </button>
            </div>
          )}
        </div>


        {/* Profile Modal */}
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md max-h-screen overflow-y-auto p-6 relative">              <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" placeholder="Provider Name" className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" placeholder="Provider Email" className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <input type="text" placeholder="07" className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input type="password" placeholder="New Password" className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    placeholder="123, Main Street"
                    value={registerData.address}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label>Province</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={registerData.province || ""}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        province: e.target.value,
                        district: "" // reset district when province changes
                      }))
                    }
                    required
                  >
                    <option value="">Select Province</option>
                    {provinces.map((prov) => (
                      <option key={prov.value} value={prov.value}>
                        {prov.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>District</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={registerData.district || ""}
                    onChange={(e) =>
                      setRegisterData((prev) => ({ ...prev, district: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select District</option>
                    {(districtsByProvince[registerData.province?.replace(/\s/g, "")] || []).map(
                      (district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    placeholder="Your company name"
                    value={registerData.company_name}
                    onChange={(e) =>
                      setRegisterData((prev) => ({ ...prev, company_name: e.target.value }))
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Description</label>
                  <textarea
                    placeholder="Short description of your company"
                    value={registerData.company_description}
                    onChange={(e) =>
                      setRegisterData((prev) => ({ ...prev, company_description: e.target.value }))
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Address</label>
                  <input
                    type="text"
                    placeholder="Company address"
                    value={registerData.address}
                    onChange={(e) =>
                      setRegisterData((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label>Province</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={registerData.province || ""}
                    onChange={(e) =>
                      setRegisterData((prev) => ({
                        ...prev,
                        province: e.target.value,
                        district: "" // reset district when province changes
                      }))
                    }
                    required
                  >
                    <option value="">Select Province</option>
                    {provinces.map((prov) => (
                      <option key={prov.value} value={prov.value}>
                        {prov.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>District</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={registerData.district || ""}
                    onChange={(e) =>
                      setRegisterData((prev) => ({ ...prev, district: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select District</option>
                    {(districtsByProvince[registerData.province?.replace(/\s/g, "")] || []).map(
                      (district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input type="url" placeholder="URL" className="w-full border px-3 py-2 rounded" />
                </div>

              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/50"
            >
              <Menu size={20} />
            </button>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="animate-slide-in">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;