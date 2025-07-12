
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import NavigationProvider from "@/components/NavigationProvider";
const IndexProvider=()=>{

    return (
         <div className="min-h-screen">
            <NavigationProvider />
            <Footer/>
         </div>
    );
};
export default IndexProvider;