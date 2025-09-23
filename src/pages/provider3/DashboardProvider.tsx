import NavigationProvider from "@/components/NavigationProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardSidebar from '@/components/uiProvider/DashboardSidebar';
import DashboardOverview from "@/components/uiProvider/DashboardOverview";
import ProductManagement from '@/components/uiProvider/ProductManagement';
import InboxManagement from "@/components/uiProvider/InboxManagement";
import ServiceManagement from "../../components/uiProvider/ServiceManagement";
import OrderManagement from "../../components/uiProvider/OrderManagement";
import ProfileManagement from "../../components/uiProvider/ProfileManagement";



const DashboardProvider=()=>{
    const [activeSection, setActiveSection] = useState('overview');
    const navigate = useNavigate();

    const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'inbox':
        return <InboxManagement />;
      case 'products':
        return <ProductManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'profile':
        return <ProfileManagement />;
      default:
        return <DashboardOverview />;
    }
  };

    return(
        <div className="min-h-screen bg-gray-50">
            <NavigationProvider />

            <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection}
      />
      <div className="lg:ml-64">
        <div className="p-6">
          {renderActiveSection()}
        </div>
      </div>

        </div>
    );
};
export default DashboardProvider;