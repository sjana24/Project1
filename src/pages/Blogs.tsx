import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, User } from "lucide-react";

// Define the structure of a blog post based on your database schema
interface Blog {
  blog_id: number;
  title: string;
  excerpt: string;
  published_at: string;
   updated_at: string; 
  read_time: number;
  category: string;
  tags: string; // comma-separated
  content: string;
}

// BlogModal component
const BlogModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  blog: Blog | null;
}> = ({ isOpen, onClose, blog }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Stop background scrolling
    } else {
      document.body.style.overflow = ""; // Restore scrolling
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-3xl font-bold text-gray-900">{blog.title}</h2>
          <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
        </div>
        <div className="text-sm text-gray-500 mt-2 flex flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(blog.published_at).toLocaleDateString()}</span>
            </div>
            {blog.updated_at !== blog.published_at && (
    <div className="flex items-center">
      <Clock className="h-4 w-4 mr-1" />
      <span>Updated: {new Date(blog.updated_at).toLocaleString()}</span>
    </div>
  )}
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{blog.read_time} min read</span>
            </div>
          </div>
        </div>
        <div
          className="prose max-w-none text-gray-700 px-8 py-6"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
      </div>
    </div>
  );
};

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all blog posts
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.get<Blog[]>(
          "http://localhost/Git/Project1/Backend/GetAllBlog.php"
         );
        setBlogs(response.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBlogs();
  }, []);

  // Fetch single blog
  const fetchBlogContent = async (blogId: number) => {
    try {
      const response = await axios.get<Blog>(
        `http://localhost/Git/Project1/Backend/GetBlogDetails.php?id=${blogId}`
      );
      setSelectedBlog(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch blog content:", error);
    }
  };

  // Categories
  const categories = ["all", ...Array.from(new Set(blogs.map((b) => b.category)))];

  // Filter blogs
  const filteredBlogs = blogs.filter(
    (blog) => selectedCategory === "all" || blog.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-xl text-gray-600">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Solar Energy Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest news, tips, and insights about solar
            energy, sustainability, and renewable technology.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`font-semibold py-2 px-4 rounded-full border text-sm transition-all
                ${
                  selectedCategory === category
                    ? "bg-[#26B170] text-white border-[#26B170]"
                    : "bg-white text-[#26B170] border-[#26B170] hover:bg-[#26B170] hover:text-white"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <article
                key={blog.blog_id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src="https://placehold.co/600x400/26B170/ffffff?text=Solar+Blog"
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(blog.published_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{blog.read_time} min read</span>
                    </div>
                  </div>

                  <div className="flex items-center mb-2">
                    <Tag className="h-4 w-4 text-[#26B170] mr-1" />
                    <span className="text-sm text-[#26B170] font-medium capitalize">
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
                      <span className="text-sm text-gray-500">Admin</span>
                    </div>

                    <Button
                      onClick={() => fetchBlogContent(blog.blog_id)}
                      className="bg-white text-[#26B170] border border-[#26B170] font-semibold py-2 px-4 rounded text-sm hover:bg-[#26B170] hover:text-white"
                    >
                      Read More
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {blog.tags
                      .split(",")
                      .slice(0, 3)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="col-span-full text-center text-lg text-gray-600">
              No blog posts found in this category.
            </p>
          )}
        </div>
      </div>
      <Footer />
      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        blog={selectedBlog}
      />
    </div>
  );
};

export default Blogs;
