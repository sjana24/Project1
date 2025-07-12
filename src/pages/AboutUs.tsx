import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Award, Lightbulb, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs =()=>{
    const values = [
    {
      icon: <Lightbulb className="h-8 w-8 text-solar-primary" />,
      title: "Innovation",
      description: "We continuously innovate to provide cutting-edge solar solutions that meet evolving energy needs."
    },
    {
      icon: <Users className="h-8 w-8 text-solar-primary" />,
      title: "Community",
      description: "Building a community of solar enthusiasts, providers, and customers working towards a sustainable future."
    },
    {
      icon: <Target className="h-8 w-8 text-solar-primary" />,
      title: "Mission-Driven",
      description: "Our mission is to accelerate the adoption of solar energy through accessible, reliable solutions."
    },
    {
      icon: <Award className="h-8 w-8 text-solar-primary" />,
      title: "Excellence",
      description: "We maintain the highest standards in product quality, customer service, and platform reliability."
    }
  ];
return (
    <div className="min-h-screen bg-gray-50"> 
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Powering a Sustainable Future
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            SolaX is the leading platform connecting solar energy customers with trusted service providers. 
            We're committed to making renewable energy accessible, affordable, and reliable for everyone.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To accelerate the global transition to clean energy by creating the most trusted, 
              comprehensive platform that connects solar customers with qualified service providers, 
              making renewable energy accessible to all.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              A world where clean, renewable energy is the primary power source for every home and business, 
              creating a sustainable future for generations to come while fostering economic growth in the green energy sector.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-solar-primary mb-2">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-solar-primary mb-2">500+</div>
              <div className="text-gray-600">Certified Providers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-solar-primary mb-2">50MW+</div>
              <div className="text-gray-600">Solar Capacity Installed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-solar-primary mb-2">25M+</div>
              <div className="text-gray-600">kWh Clean Energy Generated</div>
            </div>
          </div>
        </div>
      </div>

    <Footer/>
    </div>
);

};
export default AboutUs;