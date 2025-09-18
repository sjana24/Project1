import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import { Search, FileText, Eye, Edit, Trash2, Plus, Calendar, User } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  author: string;
  content: string;
  excerpt: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  views: number;
  likes: number;
  image_url?: string;
  tags: string[];
}

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([
    {
      id: 1,
      title: 'The Future of Solar Energy in Sri Lanka',
      author: 'Admin',
      content: 'Solar energy is rapidly becoming the preferred choice for sustainable power generation...',
      excerpt: 'Exploring the growing solar energy market in Sri Lanka and its potential for the future.',
      category: 'Technology',
      status: 'published',
      created_at: '2024-01-15',
      updated_at: '2024-01-15',
      is_featured: true,
      views: 1234,
      likes: 89,
      tags: ['solar', 'renewable', 'sri lanka']
    },
    {
      id: 2,
      title: 'How to Choose the Right Solar Panel for Your Home',
      author: 'Solar Expert',
      content: 'Choosing the right solar panel system for your home requires careful consideration...',
      excerpt: 'A comprehensive guide to selecting the perfect solar panel system for residential use.',
      category: 'Guide',
      status: 'published',
      created_at: '2024-01-18',
      updated_at: '2024-01-18',
      is_featured: false,
      views: 567,
      likes: 34,
      tags: ['guide', 'residential', 'panels']
    },
    {
      id: 3,
      title: 'Government Incentives for Solar Installation',
      author: 'Policy Analyst',
      content: 'The government has introduced several incentives to promote solar energy adoption...',
      excerpt: 'Overview of current government policies and incentives for solar energy adoption.',
      category: 'Policy',
      status: 'draft',
      created_at: '2024-01-20',
      updated_at: '2024-01-20',
      is_featured: false,
      views: 0,
      likes: 0,
      tags: ['policy', 'incentives', 'government']
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>(blogs);

  useEffect(() => {
    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const updateBlogStatus = (blogId: number, status: Blog['status']) => {
    const updatedBlogs = blogs.map(blog => {
      if (blog.id === blogId) {
        toast({
          title: "Blog Status Updated",
          description: `Blog "${blog.title}" has been ${status}`,
        });
        return { ...blog, status, updated_at: new Date().toISOString().split('T')[0] };
      }
      return blog;
    });
    setBlogs(updatedBlogs);
  };

  const toggleFeatured = (blogId: number, is_featured: boolean) => {
    const updatedBlogs = blogs.map(blog => {
      if (blog.id === blogId) {
        return { ...blog, is_featured, updated_at: new Date().toISOString().split('T')[0] };
      }
      return blog;
    });
    setBlogs(updatedBlogs);
    toast({
      title: "Blog Updated",
      description: `Blog ${is_featured ? 'featured' : 'unfeatured'} successfully`,
    });
  };

  const deleteBlog = (blogId: number) => {
    const updatedBlogs = blogs.filter(blog => blog.id !== blogId);
    setBlogs(updatedBlogs);
    toast({
      title: "Blog Deleted",
      description: "Blog has been removed from the platform",
      variant: "destructive"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
    }
  };

  const publishedBlogs = blogs.filter(b => b.status === 'published').length;
  const draftBlogs = blogs.filter(b => b.status === 'draft').length;
  const featuredBlogs = blogs.filter(b => b.is_featured).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-2">Manage blog posts and content</p>
        </div>
        <Button className="nav-gradient text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New Blog
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Blogs</p>
                <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{publishedBlogs}</p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">{draftBlogs}</p>
              </div>
              <Edit className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-purple-600">{featuredBlogs}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>Search Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by title, author, category, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Blogs List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="glass-card hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {blog.title}
                    {blog.is_featured && (
                      <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {blog.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {getStatusBadge(blog.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{blog.excerpt}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Category: {blog.category}</span>
                  <div className="flex gap-3">
                    <span>{blog.views} views</span>
                    <span>{blog.likes} likes</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Featured</span>
                  <Switch
                    checked={blog.is_featured}
                    onCheckedChange={(checked) => toggleFeatured(blog.id, checked)}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  {blog.status === 'draft' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateBlogStatus(blog.id, 'published')}
                      className="hover:bg-green-50 hover:text-green-700"
                    >
                      Publish
                    </Button>
                  )}
                  
                  {blog.status === 'published' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateBlogStatus(blog.id, 'archived')}
                      className="hover:bg-gray-50 hover:text-gray-700"
                    >
                      Archive
                    </Button>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{blog.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600">
                          By {blog.author} • {new Date(blog.created_at).toLocaleDateString()} • {blog.category}
                        </div>
                        <div className="prose max-w-none">
                          {blog.content}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteBlog(blog.id)}
                    className="hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;