import { useState, MouseEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import { Search, MessageSquare, Eye, Trash2, CheckCircle, AlertTriangle, Star, Send, EyeOff, Archive } from 'lucide-react';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';   // ✅ FIXED
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // ✅ FIXED

interface QAItem {
  id: number;
  question: string;
  answer?: string;
  asker: string;
  asker_email: string;
  answerer?: string;
  category: string;
  status: 'pending' | 'answered' | 'flagged' | 'archived' | 'hidden';
  created_at: string;
  answered_at?: string;
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
      asker_email: 'john@example.com',
      answerer: 'Solar Expert',
      category: 'Technical',
      status: 'answered',
      created_at: '2024-01-15',
      answered_at: '2024-01-16',
      is_featured: true,
      views: 234,
      votes: 12
      
    },
    {
      id: 2,
      question: 'How much does solar installation cost in Sri Lanka?',
      asker: 'Jane Smith',
      asker_email: 'jane@example.com',
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
      asker_email: 'spam@example.com',
      category: 'General',
      status: 'flagged',
      created_at: '2024-01-19',
      is_featured: false,
      views: 12,
      votes: -2
    },
    {
      id: 4,
      question: 'Do solar panels work during cloudy days?',
      answer: 'Yes, solar panels do work on cloudy days, though at reduced efficiency.',
      asker: 'Mike Johnson',
      asker_email: 'mike@example.com',
      answerer: 'Technical Team',
      category: 'Technical',
      status: 'answered',
      created_at: '2024-01-20',
      answered_at: '2024-01-21',
      is_featured: false,
      views: 156,
      votes: 15
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQA, setSelectedQA] = useState<QAItem | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const { toast } = useToast();

  const filteredQA = qaItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.asker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.asker_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatsData = () => {
    const total = qaItems.length;
    const pending = qaItems.filter(q => q.status === 'pending').length;
    const answered = qaItems.filter(q => q.status === 'answered').length;
    const flagged = qaItems.filter(q => q.status === 'flagged').length;

    return { total, pending, answered, flagged };
  };

  const stats = getStatsData();

  // ✅ Implemented functions (local state only for now)
  function deleteQA(id: number): void {
    setQaItems(prev => prev.filter(q => q.id !== id));
    toast({ title: "Deleted", description: `Q&A ${id} removed.` });
  }

  function updateQAStatus(id: number, status: QAItem["status"]): void {
    setQaItems(prev =>
      prev.map(q => (q.id === id ? { ...q, status } : q))
    );
    toast({ title: "Status updated", description: `Q&A ${id} is now ${status}` });
  }

  function submitAnswer(event: MouseEvent<HTMLButtonElement>): void {
    if (!selectedQA) return;
    setIsAnswering(true);
    setTimeout(() => {
      setQaItems(prev =>
        prev.map(q =>
          q.id === selectedQA.id
            ? { ...q, answer: answerText, status: "answered", answered_at: new Date().toISOString().split("T")[0], answerer: "Admin" }
            : q
        )
      );
      setIsAnswering(false);
      setSelectedQA(null);
      setAnswerText('');
      toast({ title: "Answer submitted", description: "Your answer has been saved." });
    }, 1000);
  }

  function toggleFeatured(id: number, checked: boolean): void {
    setQaItems(prev =>
      prev.map(q => (q.id === id ? { ...q, is_featured: checked } : q))
    );
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case "answered":
        return <Badge className="bg-green-500 text-white">Answered</Badge>;
      case "flagged":
        return <Badge className="bg-red-500 text-white">Flagged</Badge>;
      case "hidden":
        return <Badge className="bg-gray-400 text-white">Hidden</Badge>;
      case "archived":
        return <Badge className="bg-gray-600 text-white">Archived</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold qa-gradient bg-clip-text text-transparent">Q&A Management</h1>
            <p className="text-muted-foreground mt-2">Manage community questions and provide expert answers</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
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
                  <p className="text-2xl font-bold text-green-600">{stats.answered}</p>
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
                  <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
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

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>All Questions ({filteredQA.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredQA.map((qa) => (
                <div key={qa.id} className="p-6 rounded-lg border border-border hover:border-qa-primary/30 transition-all duration-200 bg-background/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        {getStatusBadge(qa.status)}
                        {qa.is_featured && (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg text-foreground mb-2">{qa.question}</h3>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">{qa.asker.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>Asked by: <strong>{qa.asker}</strong></span>
                          </div>
                          <span>{qa.asker_email}</span>
                          <Badge variant="outline">{qa.category}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{qa.views} views</span>
                          </div>
                          <span>Created: {qa.created_at}</span>
                          {qa.answered_at && <span>Answered: {qa.answered_at}</span>}
                        </div>
                      </div>

                      {qa.answer && (
                        <div className="mt-4 p-4 bg-qa-success/5 border border-qa-success/20 rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-qa-success" />
                            <span className="text-sm font-medium text-qa-success">Answer</span>
                          </div>
                          <p className="text-sm text-foreground mb-2">{qa.answer}</p>
                          <p className="text-xs text-muted-foreground">Answered by: {qa.answerer}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-3 min-w-fit">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={qa.is_featured}
                          onCheckedChange={(checked) => toggleFeatured(qa.id, checked)}
                          disabled={qa.status === 'flagged' || qa.status === 'hidden'}
                        />
                        <span className="text-xs text-muted-foreground">Featured</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {qa.status === 'pending' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedQA(qa);
                                  setAnswerText(qa.answer || '');
                                }}
                                className="hover:bg-qa-success/10 hover:text-qa-success hover:border-qa-success/30"
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Answer
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Answer Question</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-4 bg-muted/30 rounded-lg">
                                  <h4 className="font-medium mb-2">Question:</h4>
                                  <p className="text-sm">{selectedQA?.question}</p>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Asked by {selectedQA?.asker} ({selectedQA?.asker_email})
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Your Answer</label>
                                  <Textarea
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    placeholder="Provide a detailed and helpful answer..."
                                    rows={6}
                                    className="resize-none"
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedQA(null);
                                      setAnswerText('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={submitAnswer}
                                    disabled={!answerText.trim() || isAnswering}
                                    className="bg-qa-success hover:bg-qa-success/90 text-qa-success-foreground"
                                  >
                                    {isAnswering ? 'Submitting...' : 'Submit Answer'}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        {qa.status === 'answered' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedQA(qa);
                                  setAnswerText(qa.answer || '');
                                }}
                                className="hover:bg-qa-primary/10 hover:text-qa-primary hover:border-qa-primary/30"
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Edit Answer
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Answer</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-4 bg-muted/30 rounded-lg">
                                  <h4 className="font-medium mb-2">Question:</h4>
                                  <p className="text-sm">{selectedQA?.question}</p>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Your Answer</label>
                                  <Textarea
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    placeholder="Provide a detailed and helpful answer..."
                                    rows={6}
                                    className="resize-none"
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedQA(null);
                                      setAnswerText('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={submitAnswer}
                                    disabled={!answerText.trim() || isAnswering}
                                    className="bg-qa-primary hover:bg-qa-primary/90 text-qa-primary-foreground"
                                  >
                                    {isAnswering ? 'Updating...' : 'Update Answer'}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {/* Status Actions */}
                        {qa.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQAStatus(qa.id, 'answered')}
                            className="hover:bg-qa-success/10 hover:text-qa-success hover:border-qa-success/30"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                        )}
                        
                        {qa.status !== 'flagged' && qa.status !== 'hidden' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQAStatus(qa.id, 'flagged')}
                            className="hover:bg-qa-flagged/10 hover:text-qa-flagged hover:border-qa-flagged/30"
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Flag
                          </Button>
                        )}

                        {qa.status !== 'hidden' && qa.status !== 'archived' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQAStatus(qa.id, 'hidden')}
                            className="hover:bg-muted/50 hover:text-muted-foreground"
                          >
                            <EyeOff className="w-3 h-3 mr-1" />
                            Hide
                          </Button>
                        )}

                        {qa.status !== 'archived' && qa.status !== 'hidden' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQAStatus(qa.id, 'archived')}
                            className="hover:bg-muted/50 hover:text-muted-foreground"
                          >
                            <Archive className="w-3 h-3 mr-1" />
                            Archive
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteQA(qa.id)}
                          className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredQA.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No questions found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QAPage;
