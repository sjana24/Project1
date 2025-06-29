import NavigationProvider from "@/components/NavigationProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardSidebar from '@/components/uiProvider/DashboardSidebar';


const DashboardProvider=()=>{
    const [activeSection, setActiveSection] = useState('overview');
    const navigate = useNavigate();

    return(
        <div className="min-h-screen bg-gray-50">
            <NavigationProvider />

            <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection}
      />

        </div>
    );
};
export default DashboardProvider;