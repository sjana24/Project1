import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import { Search, MessageSquare, Eye, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

interface QAItem {
  id: number;
  question: string;
  answer?: string;
  asker: string;
  answerer?: string;
  category: string;
  status: 'pending' | 'answered' | 'flagged';
  created_at: string;
  is_featured: boolean;
  views: number;
  votes: number;
}

const QAPage = () => {
  const [qaItems, setQaItems] = useState<QAItem[]>([
    {
      id: 1,
      question: 'What is the average lifespan of solar panels?',
      answer: 'Solar panels typically last 25-30 years with proper maintenance.',
      asker: 'John Doe',
      answerer: 'Solar Expert',
      category: 'Technical',
      status: 'answered',
      created_at: '2024-01-15',
      is_featured: true,
      views: 234,
      votes: 12
    },
    {
      id: 2,
      question: 'How much does solar installation cost in Sri Lanka?',
      asker: 'Jane Smith',
      category: 'Pricing',
      status: 'pending',
      created_at: '2024-01-18',
      is_featured: false,
      views: 45,
      votes: 3
    },
    {
      id: 3,
      question: 'Inappropriate question with spam content',
      asker: 'Spam User',
      category: 'General',
      status: 'flagged',
      created_at: '2024-01-19',
      is_featured: false,
      views: 12,
      votes: -2
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQA, setFilteredQA] = useState<QAItem[]>(qaItems);

  useEffect(() => {
    const filtered = qaItems.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQA(filtered);
  }, [searchTerm, qaItems]);

  const updateQAStatus = (qaId: number, status: QAItem['status']) => {
    const updatedQA = qaItems.map(item => {
      if (item.id === qaId) {
        toast({
          title: "Q&A Status Updated",
          description: `Question has been ${status}`,
          variant: status === 'flagged' ? 'destructive' : 'default'
        });
        return { ...item, status };
      }
      return item;
    });
    setQaItems(updatedQA);
  };

  const toggleFeatured = (qaId: number, is_featured: boolean) => {
    const updatedQA = qaItems.map(item => {
      if (item.id === qaId) {
        return { ...item, is_featured };
      }
      return item;
    });
    setQaItems(updatedQA);
    toast({
      title: "Q&A Updated",
      description: `Question ${is_featured ? 'featured' : 'unfeatured'} successfully`,
    });
  };

  const deleteQA = (qaId: number) => {
    const updatedQA = qaItems.filter(item => item.id !== qaId);
    setQaItems(updatedQA);
    toast({
      title: "Q&A Deleted",
      description: "Question has been removed from the platform",
      variant: "destructive"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'answered':
        return <Badge className="bg-green-100 text-green-800">Answered</Badge>;
      case 'flagged':
        return <Badge className="bg-red-100 text-red-800">Flagged</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const pendingQA = qaItems.filter(q => q.status === 'pending').length;
  const answeredQA = qaItems.filter(q => q.status === 'answered').length;
  const flaggedQA = qaItems.filter(q => q.status === 'flagged').length;
  const featuredQA = qaItems.filter(q => q.is_featured).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Q&A Management</h1>
          <p className="text-gray-600 mt-2">Manage community questions and answers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{qaItems.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Answers</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingQA}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Answered</p>
                <p className="text-2xl font-bold text-green-600">{answeredQA}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-red-600">{flaggedQA}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>Search Q&A</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by question, user, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Q&A List */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>All Questions ({filteredQA.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQA.map((qa) => (
              <div key={qa.id} className="flex items-start justify-between p-4 bg-white/50 rounded-lg border border-white/20 hover:bg-white/70 transition-colors">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">{qa.question}</h3>
                        {qa.is_featured && (
                          <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>Asked by: {qa.asker}</span>
                        {qa.answerer && <span>Answered by: {qa.answerer}</span>}
                        <span>Category: {qa.category}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{qa.views} views</span>
                        <span>{qa.votes} votes</span>
                        <span>{new Date(qa.created_at).toLocaleDateString()}</span>
                      </div>
                      {qa.answer && (
                        <div className="mt-2 p-2 bg-green-50 rounded text-sm text-gray-700">
                          <strong>Answer:</strong> {qa.answer}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3 ml-4">
                  {getStatusBadge(qa.status)}
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={qa.is_featured}
                      onCheckedChange={(checked) => toggleFeatured(qa.id, checked)}
                      disabled={qa.status === 'flagged'}
                    />
                    <span className="text-xs text-gray-600">Featured</span>
                  </div>

                  <div className="flex gap-2">
                    {qa.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQAStatus(qa.id, 'answered')}
                        className="hover:bg-green-50 hover:text-green-700"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                    )}
                    
                    {qa.status !== 'flagged' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQAStatus(qa.id, 'flagged')}
                        className="hover:bg-red-50 hover:text-red-700"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Flag
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteQA(qa.id)}
                      className="hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QAPage;