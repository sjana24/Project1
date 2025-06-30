
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";


const DashboardOverview = () => {
  const currentProvider = JSON.parse(localStorage.getItem('currentProvider') || '{}');

  const stats = [
    { title: 'Total Products', value: '12', change: '+2 this month', color: 'text-solar-green' },
    { title: 'Total Services', value: '8', change: '+1 this month', color: 'text-solar-green' },
    { title: 'Total Orders', value: '34', change: '+5 this week', color: 'text-solar-green' },
    { title: 'Revenue', value: 'LKR 450,000', change: '+12% this month', color: 'text-solar-green' },
  ];

  const recentActivity = [
    { action: 'New order for Solar Panel Kit', time: '2 hours ago', type: 'order' },
    { action: 'Product "Smart Inverter" updated', time: '5 hours ago', type: 'product' },
    { action: 'New service inquiry received', time: '1 day ago', type: 'service' },
    { action: 'Order completed and rated 5 stars', time: '2 days ago', type: 'order' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Welcome back, {currentProvider.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your solar business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="solar-card-hover">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className={`text-sm font-medium ${stat.color}`}>
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest business activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'order' ? 'bg-solar-green' :
                    activity.type === 'product' ? 'bg-solar-yellow' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* <Link to="">
              <button className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-solar-green hover:bg-solar-green/5 transition-colors">
                <div className="font-medium text-gray-900">➕ Add New Product</div>
                <div className="text-sm text-gray-500">List a new solar product</div>
              </button></Link> */}
              {/* <button className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-solar-green hover:bg-solar-green/5 transition-colors">
                <div className="font-medium text-gray-900">🔧 Add New Service</div>
                <div className="text-sm text-gray-500">Offer a new service</div>
              </button> */}
              {/* <button className="w-full p-4 text-left rounded-lg border border-gray-200 hover:border-solar-green hover:bg-solar-green/5 transition-colors">
                <div className="font-medium text-gray-900">📊 View Analytics</div>
                <div className="text-sm text-gray-500">Check your performance</div>
              </button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
