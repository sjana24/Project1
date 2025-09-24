import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { FileText, Eye, Edit, Trash2, Plus, Calendar, EyeOff, Eye as EyeOpen } from "lucide-react";

interface Blog {
  excerpt: string;
  blog_id: number;
  admin_id: number | null;
  title: string;
  link: string;
  category: string;
  image?: string;
  created_at: string;
  updated_at: string;
  status: "draft" | "published" | "archived" | "hidden";
}

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Add/Edit form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    category: "",
    image: "",
  });

  // Fetch blogs from DB
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get<Blog[]>(
        "http://localhost/Git/Project1/Backend/GetAllBlog.php"
      );
      setBlogs(response.data);
      setFilteredBlogs(response.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  // Categories (with "all")
  const categories = ["all", ...Array.from(new Set(blogs.map((b) => b.category)))];

  // Filter by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter((b) => b.category === selectedCategory));
    }
  }, [selectedCategory, blogs]);

  // Blog status counters
  const publishedBlogs = blogs.filter((b) => b.status === "published").length;
  const draftBlogs = blogs.filter((b) => b.status === "draft").length;
  const archivedBlogs = blogs.filter((b) => b.status === "archived").length;

  // Delete blog
  const deleteBlog = (id: number) => {
    const updatedBlogs = blogs.filter((b) => b.blog_id !== id);
    setBlogs(updatedBlogs);
    toast({
      title: "Blog Deleted",
      description: "Blog has been removed",
      variant: "destructive",
    });
  };

  // Hide/Unhide blog
  const toggleVisibility = (id: number) => {
    setBlogs((prev) =>
      prev.map((b) =>
        b.blog_id === id
          ? { ...b, status: b.status === "hidden" ? "published" : "hidden" }
          : b
      )
    );
    toast({
      title: "Visibility Updated",
      description: "Blog visibility has been toggled",
    });
  };

  // Open Add/Edit Form
  const openForm = (blog?: Blog) => {
    if (blog) {
      setEditBlog(blog);
      setFormData({
        title: blog.title,
        link: blog.link, 
        category: blog.category,
        image: blog.image || "",
      });
    } else {
      setEditBlog(null);
      setFormData({ title: "", link: "", category: "", image: "" }); // Changed from 'link' to 'content'
    }
    setIsFormOpen(true);
  };

  // 🆕 Save Blog (Add/Edit) now calls the API
  const handleSave = async () => {
    try {
      if (editBlog) {
        // Update
        const response = await axios.put("http://localhost/Git/Project1/Backend/SaveBlog.php", {
          blog_id: editBlog.blog_id,
          ...formData,
        });
        const updatedBlog = response.data.blog;
        setBlogs((prev) =>
          prev.map((b) =>
            b.blog_id === updatedBlog.blog_id ? updatedBlog : b
          )
        );
        toast({ title: "Blog Updated", description: "Changes saved successfully" });
      } else {
        // Insert new
        const response = await axios.post("http://localhost/Git/Project1/Backend/SaveBlog.php", {
          ...formData,
        });
        const newBlog = response.data.blog;
        setBlogs((prev) => [newBlog, ...prev]);
        toast({ title: "Blog Added", description: "New blog created" });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to save blog:", error);
      toast({
        title: "Save Failed",
        description: "Could not save the blog. Please check your inputs.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-2">Manage, edit, and organize blog posts</p>
        </div>
        <Button className="nav-gradient text-white" onClick={() => openForm()}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Blog
        </Button>
      </div>

      {/* Stats
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardContent className="p-6"><p>Total Blogs</p><p className="text-2xl">{blogs.length}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p>Published</p><p className="text-2xl text-green-600">{publishedBlogs}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p>Drafts</p><p className="text-2xl text-yellow-600">{draftBlogs}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p>Archived</p><p className="text-2xl text-gray-600">{archivedBlogs}</p></CardContent></Card>
      </div> */}

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
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <Card key={blog.blog_id} className="glass-card hover:shadow-lg transition-all">
  <CardHeader>
    <div className="flex items-start justify-between">
      <div>
        <CardTitle className="text-lg">{blog.title}</CardTitle>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          {blog.created_at ? blog.created_at : "24-05-2025"}
        </div>
      </div>
    </div>
  </CardHeader>

  <CardContent>
    <img
      src={blog.image ? `http://localhost/Git/Project1/${blog.image}` : "https://placehold.co/600x400/26B170/ffffff?text=Blog"}
      alt={blog.title}
      className="w-full h-40 object-cover rounded mb-3"
    />

    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
      {blog.excerpt}{" "}
      {blog.link && (
        <a
          href={blog.link}  
          className="text-[#26B170] font-semibold hover:underline ml-1"
        >
          Read more on Wikipedia →
        </a>
      )}
    </p>

    {/* Action buttons */}
    <div className="flex gap-2 pt-2">
      <Button variant="outline" size="sm" onClick={() => openForm(blog)}>
        <Edit className="w-3 h-3 mr-1" />
      </Button>

      <Button variant="outline" size="sm" onClick={() => toggleVisibility(blog.blog_id)}>
        {blog.status === "hidden" ? <EyeOpen className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
      </Button>

      <Button variant="outline" size="sm" onClick={() => deleteBlog(blog.blog_id)} className="hover:bg-red-50 hover:text-red-700">
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  </CardContent>
</Card>

        ))}
      </div>

      {/* Add/Edit Blog Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editBlog ? "Edit Blog" : "Add New Blog"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <Input placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
            <Input placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
            <Textarea rows={5} placeholder="Link" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editBlog ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default BlogsPage;
