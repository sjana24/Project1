import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";




const Index = () => {
    const location = useLocation();
      const { name, email } = location.state || {};
    //   {name && <h2>Welcome, {name}!</h2>}


    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Homeowner",
            content: "SolaX helped me find the perfect solar solution for my home. The installation was seamless and I'm already seeing savings on my energy bills!",
            rating: 5
        },
        {
            name: "Mike Chen",
            role: "Business Owner",
            content: "The commercial solar installation exceeded our expectations. Great service, quality products, and excellent ROI.",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            role: "Environmental Engineer",
            content: "As a professional in the field, I appreciate SolaX's commitment to quality and sustainability. Highly recommended!",
            rating: 5
        }
    ];
    const stats = [
        { number: "10,000+", label: "staised Customers" },
        { number: "500+", label: "Certified Agents" },
        { number: "50MW", label: "Solar Capacity Installed" },
        { number: "24/7", label: "Expert Support" }
    ];
    return (
        <div className="min-h-screen">
            <Navigation />
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 solar-gradient opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="animate-fade-in">
                            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
                                Power Your Future with
                                <span className="block text-primary">Solar Energy</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Discover trusted solar products, connect with certified professionals,
                                and join the renewable energy revolution. Your sustainable future starts here.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/products">
                                    <Button size="lg" className="solar-gradient text-white hover:scale-105 transition-transform">
                                        Explore Products

                                    </Button>
                                </Link>
                                <Link to="/services">
                                    <Button size="lg" variant="outline" className="hover:scale-105 transition-transform">
                                        Find Services
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Stats Section */}
            <section className="py-16 bg-secondary/50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Ready to Go Solar?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of satisfied customers who've made the switch to clean, renewable energy.
                            Start your solar journey today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/contact">
                                <Button size="lg" className="solar-gradient text-white hover:scale-105 transition-transform">
                                    Get Free Consultation
                                    {/* <CheckCircle className="ml-2 h-5 w-5" /> */}
                                </Button>
                            </Link>
                            {/* {!(user)?( */}
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="hover:scale-105 transition-transform">
                                    Create Account
                                </Button>
                            </Link>
                            {/* ):(<></>)} */}
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>


    );
};
export default Index;