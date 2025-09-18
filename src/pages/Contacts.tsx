import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, MessageSquare, Search, ThumbsUp, ThumbsDown, Send, HelpCircle, CheckCircle2, Contact } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

interface QAItem {
  id: number;
  question: string;
  answer?: string;
  asker: string;
  answerer?: string;
  category: string;
  status: 'pending' | 'answered' | 'flagged';
  created_at: string;
  answered_at?: string;
  is_featured: boolean;
  views: number;
  votes: number;
  userVote?: 'up' | 'down' | null;
}

const Contacts = () => {
  const [questionForm, setQuestionForm] = useState({
    question: "",
    category: "",
    email: "",
    name: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [qaItems, setQaItems] = useState<QAItem[]>([
    {
      id: 1,
      question: 'What is the average lifespan of solar panels?',
      answer: 'Solar panels typically last 25-30 years with proper maintenance. Most manufacturers offer warranties of 20-25 years, and panels often continue producing electricity well beyond their warranty period, albeit at slightly reduced efficiency.',
      asker: 'John Doe',
      answerer: 'Solar Expert Team',
      category: 'Technical',
      status: 'answered',
      created_at: '2024-01-15',
      answered_at: '2024-01-16',
      is_featured: true,
      views: 234,
      votes: 12,
      userVote: null
    },
    {
      id: 2,
      question: 'How much does solar installation cost in Sri Lanka?',
      answer: 'Solar installation costs in Sri Lanka typically range from LKR 150,000 to LKR 500,000 for residential systems, depending on system size, panel quality, and installation complexity. We offer free consultations to provide accurate quotes based on your specific needs.',
      asker: 'Jane Smith',
      answerer: 'Pricing Specialist',
      category: 'Pricing',
      status: 'answered',
      created_at: '2024-01-18',
      answered_at: '2024-01-19',
      is_featured: false,
      views: 89,
      votes: 8,
      userVote: null
    },
    {
      id: 3,
      question: 'Do solar panels work during cloudy days?',
      answer: 'Yes, solar panels do work on cloudy days, though at reduced efficiency. Modern panels can generate 20-30% of their peak output even on overcast days. Our systems are designed to maximize energy capture in various weather conditions.',
      asker: 'Mike Johnson',
      answerer: 'Technical Team',
      category: 'Technical',
      status: 'answered',
      created_at: '2024-01-20',
      answered_at: '2024-01-21',
      is_featured: true,
      views: 156,
      votes: 15,
      userVote: null
    },
    {
      id: 4,
      question: 'What maintenance is required for solar panels?',
      asker: 'Sarah Wilson',
      category: 'Maintenance',
      status: 'pending',
      created_at: '2024-01-22',
      is_featured: false,
      views: 23,
      votes: 2,
      userVote: null
    }
  ]);

  const { toast } = useToast();

  const categories = ["Technical", "Pricing", "Installation", "Maintenance", "General"];

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that the name only contains letters and spaces
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(questionForm.name)) {
      toast({
        title: "Validation Error",
        description: "Your name can only contain letters and spaces.",
        variant: "destructive",
      });
      return; // Stop the form submission
    }

    try {
      // Backend integration
      const res = await axios.post("http://localhost/Git/Project1/Backend/SubmitQuestion.php", questionForm, { withCredentials: true });

      if (res.data.success) {
        toast({
          title: "Question Submitted!",
          description: "Your question has been submitted. We'll answer it soon.",
        });
        
        // Add to local state for immediate feedback
        const newQuestion: QAItem = {
          id: Date.now(),
          question: questionForm.question,
          asker: questionForm.name,
          category: questionForm.category,
          status: 'pending',
          created_at: new Date().toISOString().split('T')[0],
          is_featured: false,
          views: 0,
          votes: 0,
          userVote: null
        };
        
        setQaItems(prev => [newQuestion, ...prev]);
        setQuestionForm({ question: "", category: "", email: "", name: "" });
      } else {
        toast({
          title: "Submission Failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error submitting question:", err);
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleVote = (qaId: number, voteType: 'up' | 'down') => {
    setQaItems(prev => prev.map(item => {
      if (item.id === qaId) {
        const currentVote = item.userVote;
        let newVotes = item.votes;
        let newUserVote: 'up' | 'down' | null = voteType;

        // Remove previous vote
        if (currentVote === 'up') newVotes--;
        if (currentVote === 'down') newVotes++;

        // Apply new vote
        if (voteType === 'up') {
          if (currentVote === 'up') {
            newVotes--;
            newUserVote = null;
          } else {
            newVotes++;
          }
        } else {
          if (currentVote === 'down') {
            newVotes++;
            newUserVote = null;
          } else {
            newVotes--;
          }
        }

        return { ...item, votes: newVotes, userVote: newUserVote };
      }
      return item;
    }));
  };

  const filteredQAs = qaItems.filter(qa => {
    const matchesSearch = qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          qa.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          qa.asker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || qa.category === selectedCategory;
    return matchesSearch && matchesCategory && qa.status !== 'flagged';
  });

  const featuredQAs = filteredQAs.filter(qa => qa.is_featured && qa.status === 'answered');
  const regularQAs = filteredQAs.filter(qa => !qa.is_featured);

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      details: "contact@solax.com",
      action: "mailto:contact@solax.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 8am to 6pm",
      details: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Our headquarters",
      details: "123 Solar Street, Green City, CA 90210",
      action: "https://www.google.com/maps"
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "When we're available",
      details: "Mon-Fri: 8am-6pm PST",
      action: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navigation/>
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contact Us & Ask Questions 
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about solar energy? Browse our Q&A or ask your own question!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="glass-effect qa-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <HelpCircle className="h-5 w-5 text-text-600" />
                    Need Direct Help?
                  </CardTitle>
                  <CardDescription>
                    For urgent matters, contact us directly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-qa-primary/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-5 w-5 text-qa-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{info.description}</p>
                        {info.action !== "#" ? (
                          <a href={info.action} className="text-sm font-medium text-qa-primary hover:underline">
                            {info.details}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-foreground">{info.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Ask Question Form & Q&A List */}
            <div className="lg:col-span-2 space-y-8">
              {/* Ask Question Form */}
              <Card className="glass-effect qa-shadow">
                <CardHeader>
                  <CardTitle className="qa-gradient bg-clip-text text-green-600">Ask a Question</CardTitle>
                  <CardDescription>
                    Submit your question and our experts will answer it
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleQuestionSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                          Your Name *
                        </label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          required
                          value={questionForm.name}
                          onChange={e => {
                            // Validate that the input is a string (letters and spaces only)
                            const sanitizedValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                            setQuestionForm({ ...questionForm, name: sanitizedValue });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          required
                          value={questionForm.email}
                          onChange={e => setQuestionForm({ ...questionForm, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium text-foreground">
                        Category *
                      </label>
                      <Select value={questionForm.category} onValueChange={(value) => setQuestionForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="question" className="text-sm font-medium text-foreground">
                        Your Question *
                      </label>
                      <Textarea
                        id="question"
                        placeholder="Please describe your question in detail..."
                        rows={4}
                        required
                        value={questionForm.question}
                        onChange={e => setQuestionForm({ ...questionForm, question: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="bg-green-500 hover:bg-qa-primary/90 text-qa-primary-foreground">
                      <Send className="mr-2 h-4 w-4" />
                      Submit Question
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Search and Filter */}
              <Card className="glass-effect">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search questions and answers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Q&As */}
              {featuredQAs.length > 0 && (
                <Card className="glass-effect qa-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Featured Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {featuredQAs.map((qa) => (
                      <div key={qa.id} className="p-4 rounded-lg border border-qa-primary/20 bg-qa-primary/5">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="bg-qa-primary text-green-600-foreground">Featured</Badge>
                          <div className="text-xs text-muted-foreground">{qa.views} views</div>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{qa.question}</h3>
                        {qa.answer && (
                          <div className="bg-background/50 p-3 rounded-md mb-3">
                            <p className="text-sm text-foreground">{qa.answer}</p>
                            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                              <span>Answered by {qa.answerer}</span>
                              <span>{qa.answered_at}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Asked by {qa.asker}</span>
                            <Badge variant="outline">{qa.category}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-green-500">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(qa.id, 'up')}
                              className={qa.userVote === 'up' ? 'text-qa-success' : ''}
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {qa.votes > 0 ? qa.votes : ''}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(qa.id, 'down')}
                              className={qa.userVote === 'down' ? 'text-qa-flagged' : ''}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* All Q&As */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">All Questions ({regularQAs.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {regularQAs.map((qa) => (
                    <div key={qa.id} className="p-4 rounded-lg border border-border hover:border-qa-primary/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant={qa.status === 'answered' ? 'default' : 'secondary'}>
                          {qa.status === 'answered' ? 'Answered' : 'Pending'}
                        </Badge>
                        <div className="text-xs text-muted-foreground">{qa.views} views</div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{qa.question}</h3>
                      {qa.answer && (
                        <div className="bg-muted/30 p-3 rounded-md mb-3">
                          <p className="text-sm text-foreground">{qa.answer}</p>
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>Answered by {qa.answerer}</span>
                            <span>{qa.answered_at}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Asked by {qa.asker}</span>
                          <Badge variant="outline">{qa.category}</Badge>
                          <span>{qa.created_at}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-500">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(qa.id, 'up')}
                            className={qa.userVote === 'up' ? 'text-qa-success' : ''}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {qa.votes > 0 ? qa.votes : ''}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(qa.id, 'down')}
                            className={qa.userVote === 'down' ? 'text-qa-flagged' : ''}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {regularQAs.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No questions found matching your search.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contacts;