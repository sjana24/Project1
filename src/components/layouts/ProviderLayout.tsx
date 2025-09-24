import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Package,
  Briefcase,
  Bell,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Wrench,
  Layers,
  Edit,
  User
} from 'lucide-react';
import { Button } from '../ui/button';
import axios from 'axios';
import { IOngoingProject, IOrder, IOrderItem, IProduct, IService } from '@/store/providerCommonInterfaces';

const navigation = [
  { name: 'Dashboard', href: '/service_provider/dashboard', icon: Home },
  { name: 'Products & Orders', href: '/service_provider/product_order', icon: Package },
  { name: 'Services Requests and Projects', href: '/service_provider/service_order', icon: Wrench },
  { name: 'Jobs & Requests', href: '/service_provider/job_request', icon: Briefcase },
  { name: 'Chat Request', href: '/service_provider/chat', icon: Bell },
  { name: 'Message', href: '/service_provider/MessagePro', icon: MessageSquare },
  { name: 'Question and Answer', href: '/service_provider/qa', icon: MessageSquare },
  { name: 'Transaction', href: '/service_provider/payment', icon: MessageSquare },
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
  const [dataRaw, setDataRaw] = useState<any>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [projects, setProjects] = useState<IOngoingProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get("http://localhost/Git/Project1/Backend/ProviderDashBoard.php", { withCredentials: true });
      if (res.data && res.data.success) {
        const payload = res.data.data ?? res.data;
        setDataRaw(payload);

        const parsedProducts = (payload.products || []).map((p: any): IProduct => ({
          product_id: Number(p.product_id),
          provider_id: Number(p.provider_id),
          name: p.name ?? '',
          description: p.description ?? '',
          price: Number(p.price ?? 0),
          category: p.category ?? '',
          images: p.images ?? '',
          specifications: p.specifications ?? null,
          is_approved: Number(p.is_approved ?? 0),
          is_delete: Number(p.is_delete ?? 0),
          created_at: p.created_at ?? '',
          updated_at: p.updated_at ?? '',
          status: (Number(p.is_approved ?? 0) === 1)
            ? 'approved'
            : (Number(p.is_delete ?? 0) === 1 ? 'rejected' : 'pending'),
        }));

        const parsedServices = (payload.services || []).map((s: any): IService => ({
          service_id: Number(s.service_id),
          provider_id: Number(s.provider_id),
          name: s.name ?? '',
          description: s.description ?? '',
          price: Number(s.price ?? 0),
          category: s.category ?? '',
          is_approved: Number(s.is_approved ?? 0),
          is_active: Number(s.is_active ?? 0),
          is_delete: Number(s.is_delete ?? 0),
          created_at: s.created_at ?? '',
          updated_at: s.updated_at ?? '',
          status: Number(s.is_active ?? 0) === 1
            ? 'active'
            : (Number(s.is_approved ?? 0) === 1 ? 'approved' : 'inactive'),
        }));

        const parsedOrders = (payload.orders || []).map((o: any): IOrder => ({
          order_id: Number(o.order_id),
          customer_id: Number(o.customer_id),
          order_date: o.order_date ?? '',
          total_amount: Number(o.total_amount ?? 0),
          delivery_charge: Number(o.delivery_charge ?? 0),
          status: (o.status ?? '').toString(),
          shipping_address: o.shipping_address ?? '',
          payment_status: o.payment_status ?? '',
          created_at: o.created_at ?? '',
          updated_at: o.updated_at ?? '',
          provider_total_amount: Number(o.provider_total_amount ?? 0),
          provider_total_items: Number(o.provider_total_items ?? 0),
          items: (o.items || []).map((it: any): IOrderItem => ({
            item_id: Number(it.item_id),
            order_id: Number(it.order_id),
            product_id: Number(it.product_id),
            quantity: Number(it.quantity),
            unit_price: Number(it.unit_price ?? 0),
            subtotal: Number(it.subtotal ?? 0),
            product_name: it.product_name ?? '',
            product_images: it.product_images ?? '',
            product_category: it.product_category ?? '',
          })),
        }));

        const parsedProjects = (payload.ongoing_projects || payload.projects || []).map((p: any): IOngoingProject => ({
          project_id: Number(p.project_id),
          request_id: Number(p.request_id),
          project_name: p.project_name ?? '',
          status: p.status ?? '',
          start_date: p.start_date ?? '',
          due_date: p.due_date ?? '',
          completed_date: p.completed_date ?? null,
          payment_id: p.payment_id !== undefined ? (p.payment_id === null ? null : Number(p.payment_id)) : null,
          created_at: p.created_at ?? '',
          updated_at: p.updated_at ?? '',
        }));

        setProducts(parsedProducts);
        setServices(parsedServices);
        setOrders(parsedOrders);
        setProjects(parsedProjects);
      } else {
        setError(res.data?.message ?? 'Failed to fetch dashboard data');
      }
    } catch (e: any) {
      console.error('Fetch Provider Dashboard error', e);
      setError(e?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

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
        className={`fixed inset-y-0 left-0 z-50 w-96 bg-white/80 backdrop-blur-lg border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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

        <nav className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
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
        <div className="p-4 border-t border-white/20 relative mb-24">
          <div
            className="w-full"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Button
              variant="outline"
              className="w-full flex items-center gap-3 rounded-xl bg-green-500 text-black hover:bg-teal-600 transition-colors duration-300"
            >
              <User className="w-5 h-5 text-black" />
              <span className="font-medium">Hi, {providerName || "Provider"}</span>
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
                className="flex items-center w-full text-left text-sm text-blue-600 hover:underline gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="block mt-2 w-full text-left text-sm text-red-600 hover:underline"
              >
                <LogOut size={16} className="inline-block mr-5" />
                Logout
              </button>
            </div>
          )}
        </div>



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

        {/* Profile Modal */}
        {isProfileModalOpen && (
          <div className=" pt-10 fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-2xl max-h-screen overflow-y-auto p-6 relative">
            <button
        onClick={() => setIsProfileModalOpen(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
      >
        &times;
      </button>
              <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Profile</h2>
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
    </div>
  );
};

export default ProviderLayout;