import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  UserPlus, 
  ShoppingCart, 
  Star,
  MessageSquare,
  Settings,
  Trash2
} from 'lucide-react';

interface Notification {
  id: number;
  type: 'registration' | 'review' | 'support' | 'system' | 'order' | 'approval';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  created_at: string;
  action_required: boolean;
  related_id?: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'registration',
      title: 'New Provider Registration',
      message: 'Solar Tech Solutions has registered as a new provider and requires verification.',
      priority: 'high',
      read: false,
      created_at: '2024-01-21T10:30:00Z',
      action_required: true,
      related_id: 'provider_123'
    },
    {
      id: 2,
      type: 'review',
      title: 'Inappropriate Review Detected',
      message: 'A review containing inappropriate content has been flagged for moderation.',
      priority: 'urgent',
      read: false,
      created_at: '2024-01-21T09:15:00Z',
      action_required: true,
      related_id: 'review_456'
    },
    {
      id: 3,
      type: 'support',
      title: 'New Support Ticket',
      message: 'Customer John Doe has submitted a support ticket regarding payment issues.',
      priority: 'medium',
      read: false,
      created_at: '2024-01-21T08:45:00Z',
      action_required: true,
      related_id: 'ticket_789'
    },
    {
      id: 4,
      type: 'order',
      title: 'Large Order Placed',
      message: 'A high-value order (Rs. 250,000) has been placed and requires verification.',
      priority: 'high',
      read: true,
      created_at: '2024-01-21T07:20:00Z',
      action_required: false,
      related_id: 'order_101'
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update Completed',
      message: 'Platform maintenance has been completed successfully. All systems are operational.',
      priority: 'low',
      read: true,
      created_at: '2024-01-21T06:00:00Z',
      action_required: false
    },
    {
      id: 6,
      type: 'approval',
      title: 'Product Approval Pending',
      message: '5 new products are awaiting approval from the moderation team.',
      priority: 'medium',
      read: false,
      created_at: '2024-01-21T05:30:00Z',
      action_required: true,
      related_id: 'products_batch_12'
    }
  ]);

  const markAsRead = (notificationId: number) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    setNotifications(updatedNotifications);
    toast({
      title: "Notification Marked as Read",
      description: "The notification has been marked as read.",
    });
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    toast({
      title: "All Notifications Read",
      description: "All notifications have been marked as read.",
    });
  };

  const deleteNotification = (notificationId: number) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
    setNotifications(updatedNotifications);
    toast({
      title: "Notification Deleted",
      description: "The notification has been removed.",
      variant: "destructive"
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'support':
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      case 'order':
        return <ShoppingCart className="w-5 h-5 text-green-500" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-500" />;
      case 'approval':
        return <CheckCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.action_required && !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">Stay updated with platform alerts and activities</p>
        </div>
        <Button onClick={markAllAsRead} variant="outline">
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Action Required</p>
                <p className="text-2xl font-bold text-purple-600">{actionRequiredCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-blue-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        {getPriorityBadge(notification.priority)}
                        {notification.action_required && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Action Required
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {!notification.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="hover:bg-blue-50"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
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

export default NotificationsPage;