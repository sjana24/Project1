import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, User } from "lucide-react";
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react";


// Define the structure of a blog post based on your database schema
export type Blog = {
  blog_id: number;
  title: string;
  excerpt: string;
  published_at: string;
  updated_at: string;
  read_time: number;
  category: string;
  tags: string; // comma-separated
  content: string;
};

// Comment Section Component
const CommentSection: React.FC<{ blogId: number }> = ({ blogId }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState("");
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Comment submitted: ${comment}`);
    setComment("");
    setShowCommentForm(false);
  };


  return (
    <div>
      {/* Comment Button */}
      <button
        onClick={() => setShowCommentForm(!showCommentForm)}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        <MessageSquare className="w-5 h-5" />
        <span>Comment</span>
      </button>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white border rounded-lg shadow-lg p-4 z-10">
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows={3}
            />
            <button
              type="submit"
              className="bg-[#26B170] text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Submit Comment
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

// Share Section Component
const ShareSection: React.FC<{ blog: Blog }> = ({ blog }) => {
  const [showShare, setShowShare] = useState(false);
  const shareUrl = `https://example.com/blog/${blog.blog_id}`;

  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={() => setShowShare(!showShare)}
        className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
      >
        <Share2 className="w-5 h-5" />
        <span>Share</span>
      </button>

      {/* Social Share Options */}
      {showShare && (
        <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-3 z-20 min-w-max">
          <div className="flex gap-3 items-center">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline transition"
              title="Share on Facebook"
            >
              <img
                src="/public/facebook-logo.png.webp"
                alt="Facebook"
                className="w-5 h-5"
              />

              <span className="text-sm">Facebook</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sky-500 hover:underline transition"
              title="Share on Twitter"
            >
              <img
                src="/public/Twitter-logo.jpg"
                alt="Twitter"
                className="w-5 h-5"
              />
              <span className="text-sm">Twitter</span>
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-700 hover:underline transition"
              title="Share on LinkedIn"
            >
              <img
                src="/public/LinkedIn.png"
                alt="LinkedIn"
                className="w-5 h-5"
              />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + " " + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-green-600 hover:underline transition"
              title="Share on WhatsApp"
            >
              <img
                src="/public/whatsapp-logo.jpg"
                alt="WhatsApp"
                className="w-5 h-5"
              />
              <span className="text-sm">WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};


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
              <span>
                {blog.published_at
                  ? new Date(blog.published_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            {blog.updated_at && blog.updated_at !== blog.published_at && (
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

        {/* Buttons Section */}
        <div className="px-8 pb-6">
          <div className="relative flex gap-2 items-start">
            {/* Like Button */}
            <button
              onClick={() => alert("Like button clicked!")}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>Like</span>
            </button>

            {/* Comment Section */}
            {blog && <CommentSection blogId={blog.blog_id} />}

            {/* Share Section */}
            <ShareSection blog={blog} />
          </div>
        </div>

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
                ${selectedCategory === category
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
                        {blog.published_at
                          ? new Date(blog.published_at).toLocaleDateString()
                          : "N/A"}
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