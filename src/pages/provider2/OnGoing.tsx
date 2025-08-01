import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Clock, 
  DollarSign, 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  AlertTriangle
} from 'lucide-react';

// Mock data for ongoing projects
const mockOngoingProjects = [
  {
    id: '1',
    orderNumber: 'PRJ-2024-001',
    projectTitle: 'Residential Solar Installation',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1 (555) 123-4567',
    address: '123 Main St, Springfield, IL 62701',
    budget: 15000,
    status: 'in-progress',
    priority: 'high',
    startDate: '2024-02-01',
    estimatedCompletion: '2024-02-15',
    actualProgress: 65,
    paymentStatus: 'paid',
    description: 'Complete solar panel installation for 3-bedroom house including inverter and battery storage',
    milestones: [
      { name: 'Site Survey', completed: true, date: '2024-02-01' },
      { name: 'Permits Acquired', completed: true, date: '2024-02-03' },
      { name: 'Equipment Delivery', completed: true, date: '2024-02-05' },
      { name: 'Panel Installation', completed: false, date: '2024-02-10' },
      { name: 'System Testing', completed: false, date: '2024-02-13' },
      { name: 'Final Inspection', completed: false, date: '2024-02-15' }
    ]
  },
  {
    id: '2',
    orderNumber: 'PRJ-2024-002',
    projectTitle: 'Commercial Solar Setup',
    customerName: 'ABC Corporation',
    customerEmail: 'contact@abc-corp.com',
    customerPhone: '+1 (555) 987-6543',
    address: '456 Business Ave, Chicago, IL 60601',
    budget: 75000,
    status: 'in-progress',
    priority: 'medium',
    startDate: '2024-01-15',
    estimatedCompletion: '2024-03-30',
    actualProgress: 35,
    paymentStatus: 'paid',
    description: 'Large-scale solar installation for office building with 50kW capacity',
    milestones: [
      { name: 'Site Survey', completed: true, date: '2024-01-15' },
      { name: 'Engineering Design', completed: true, date: '2024-01-22' },
      { name: 'Permits & Approvals', completed: false, date: '2024-02-05' },
      { name: 'Equipment Procurement', completed: false, date: '2024-02-15' },
      { name: 'Installation Phase 1', completed: false, date: '2024-03-01' },
      { name: 'Installation Phase 2', completed: false, date: '2024-03-15' },
      { name: 'System Commissioning', completed: false, date: '2024-03-25' }
    ]
  },
  
];

const OnGoingProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isOverdue = (estimatedCompletion: string) => {
    return new Date(estimatedCompletion) < new Date();
  };

  const getDaysRemaining = (estimatedCompletion: string) => {
    const today = new Date();
    const completion = new Date(estimatedCompletion);
    const diffTime = completion.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredProjects = mockOngoingProjects.filter(project =>
    project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProjects = mockOngoingProjects.length;
  const highPriorityProjects = mockOngoingProjects.filter(p => p.priority === 'high').length;
  const overdueProjects = mockOngoingProjects.filter(p => isOverdue(p.estimatedCompletion)).length;
  const avgProgress = Math.round(mockOngoingProjects.reduce((sum, p) => sum + p.actualProgress, 0) / totalProjects);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ongoing Projects</h1>
        <p className="text-muted-foreground">Track and manage your active solar installation projects</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{totalProjects}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityProjects}</p>
              </div>
              <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-orange-600">{overdueProjects}</p>
              </div>
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold text-green-600">{avgProgress}%</p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search ongoing projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No ongoing projects found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredProjects.map((project) => {
            const daysRemaining = getDaysRemaining(project.estimatedCompletion);
            const overdue = isOverdue(project.estimatedCompletion);
            const completedMilestones = project.milestones.filter(m => m.completed).length;
            
            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{project.projectTitle}</CardTitle>
                        <Badge className={`px-2 py-1 text-xs border ${getPriorityColor(project.priority)}`}>
                          {project.priority.toUpperCase()}
                        </Badge>
                        {overdue && (
                          <Badge variant="destructive">
                            OVERDUE
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Order #{project.orderNumber}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {project.customerName}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${project.budget.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {overdue ? 'Overdue by' : 'Due in'} {Math.abs(daysRemaining)} days
                        </p>
                        <p className="text-sm font-medium">
                          {new Date(project.estimatedCompletion).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Project Progress</span>
                        <span className="text-sm text-muted-foreground">{project.actualProgress}%</span>
                      </div>
                      <Progress 
                        value={project.actualProgress} 
                        className="h-2"
                      />
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground">{project.description}</p>

                    {/* Milestones */}
                    <div>
                      <h4 className="font-medium mb-3">Project Milestones ({completedMilestones}/{project.milestones.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {project.milestones.map((milestone, index) => (
                          <div 
                            key={index}
                            className={`p-2 rounded-lg border text-sm ${
                              milestone.completed 
                                ? 'bg-green-50 border-green-200 text-green-800' 
                                : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle className={`h-4 w-4 ${milestone.completed ? 'text-green-600' : 'text-gray-400'}`} />
                              <span className="font-medium">{milestone.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(milestone.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Contact */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Customer Contact</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{project.customerEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{project.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 md:col-span-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{project.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Button variant="default" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Customer
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Update Timeline
                      </Button>
                      <Button variant="outline" size="sm">
                        Mark Milestone Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OnGoingProjects;