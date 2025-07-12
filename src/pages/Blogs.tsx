import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { mockBlogs } from "@/store/mockData";
import { Calendar, Clock, Tag, User } from "lucide-react";

import { useState } from "react";

const Blogs: React.FC =() => {
    const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', ...Array.from(new Set(mockBlogs.map(blog => blog.category)))];
  
  const filteredBlogs = mockBlogs.filter(blog => 
    selectedCategory === 'all' || blog.category === selectedCategory
  );
return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Solar Energy Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest news, tips, and insights about solar energy, 
            sustainability, and renewable technology.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          
        </div>

         {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map(blog => (
            <article key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                //src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {/* </div></div><span>{new Date(Blogs.publishedAt).toLocaleDateString()}</span> */}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {/* <span>{blog.readTime} min read</span> */}
                  </div>
                </div>
                
                <div className="flex items-center mb-2">
                  <Tag className="h-4 w-4 text-solar-primary mr-1" />
                  <span className="text-sm text-solar-primary font-medium capitalize">
                    {blog.category}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {blog.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-1" />
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Read More
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {blog.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        
    </div>
    </div>
    <Footer/>
    </div>
);

}
export default Blogs;