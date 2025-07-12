
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const DashboardSidebar = ({ activeSection, onSectionChange }: DashboardSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'inbox', name: 'Inbox', icon:"A" },
    { id: 'products', name: 'Products', icon: '📦' },
    { id: 'services', name: 'Services', icon: '🔧' },
    { id: 'orders', name: 'Orders', icon: '📋' },
    { id: 'profile', name: 'Profile', icon: '👤' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('currentProvider');
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-solar-green text-black">
      {/* Logo */}
      {/* <div className="p-6 border-b border-solar-green-light"> */}
        {/* <div className="flex items-center"> */}
          {/* <div className="w-10 h-10 bg-solar-yellow rounded-lg flex items-center justify-center mr-3"> */}
            {/* <span className="text-solar-green font-bold text-xl">S</span> */}
          {/* </div> */}
          {/* <span className="font-display font-bold text-2xl">SolaX</span> */}
        {/* </div> */}
        {/* <p className="text-sm text-solar-green-light mt-2">Provider Dashboard</p> */}
      {/* </div> */}

      {/* Navigation */}
      {/* <nav className="flex-1 p-4 bg-yellow-400 top-10"> */}
              <nav className="sticky top-20 bottom-20  h-full my-10  bg-yellow-400 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  onSectionChange(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'bg-solar-yellow text-black font-medium'
                    : 'text-black hover:bg-solar-green-light'
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-solar-green-light bg-red-300">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-white  hover:bg-white hover:text-solar-green"
        >
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden mb-4">
            <span className="mr-2">☰</span>
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default DashboardSidebar;
