import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useEffect,useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { Sun, Zap, Users, BookOpen, MessageSquare, Briefcase, Star, ArrowRight, CheckCircle } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}


const Index = () => {
    const location = useLocation();

    const {checkSession} =useAuth();
      const [currentUser, setCurrentUser] = useState<User | null>(() => null);
      const { name, email } = location.state || {};

    //   {name && <h2>Welcome, {name}!</h2>}

    useEffect(() => {
        const fetchUser = async () => {
          const user = await checkSession();
          setCurrentUser(user);
        };
    
        if (!currentUser) {
          fetchUser();
        }
      }, [currentUser, checkSession]);
       const features = [
    {
      icon: Sun,
      title: "Trusted Solar Products",
      description: "High-quality solar panels, batteries, and inverters from certified manufacturers.",
      link: "/products"
    },
    {
      icon: Zap,
      title: "Expert Services",
      description: "Professional installation, maintenance, and consultation services.",
      link: "/services"
    },
    {
      icon: Users,
      title: "Certified Agents",
      description: "Connect with experienced solar energy professionals in your area.",
      link: "/agents"
    },
    {
      icon: BookOpen,
      title: "Expert Blogs",
      description: "Stay informed with the latest solar energy insights and trends.",
      link: "/blog"
    },
    {
      icon: MessageSquare,
      title: "Q&A Forum",
      description: "Get answers from solar experts and community members.",
      link: "/forum"
    },
    {
      icon: Briefcase,
      title: "Career Opportunities",
      description: "Explore exciting job opportunities in the solar energy industry.",
      link: "/jobs"
    }
  ];

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
                <div className="absolute inset-0 bg-[url('/solax.png')] bg-cover bg-center opacity-50" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="animate-fade-in">
                            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
                                Power Your Future with
                                <span className="block text-[#205072]">Solar Energy</span>
                            </h1>
                            <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
                                Discover trusted solar products, connect with certified professionals,
                                and join the renewable energy revolution. Your sustainable future starts here.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/products">
                                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-green-400 text-white hover:scale-105 transition-transform">
                                        Explore Products
                                    </Button>
                                </Link>
                                <Link to="/services">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="text-[#26B170] border-[#26B170] hover:bg-[#26B170] hover:text-white transition-transform hover:scale-105"
                                    >
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
                                <div className="text-3xl md:text-4xl font-bold text-[hsl(170,100%,35%)] mb-2">{stat.number}</div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need for Solar
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From products to services, experts to community - we're your complete solar energy platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 glass-effect">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-3xl p-12 text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Ready to Go Solar?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of satisfied customers who've made the switch to clean, renewable energy.
                            Start your solar journey today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">

                            <Link to="/contacts">
                                <Button size="lg" className="solar-gradient text-white hover:scale-105 transition-transform">

                                    Get Free Consultation
                                    {/* <CheckCircle className="ml-2 h-5 w-5" /> */}
                                </Button>
                            </Link>
                            {!(currentUser)?(
                            <Link to="/login">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="text-[#26B170] border-[#26B170] hover:bg-[#26B170] hover:text-white transition-transform hover:scale-105"
                                >
                                    Create Account
                                </Button>
                            </Link>
                              ):(null)} 
                        </div>
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>


    );
};
export default Index;