
import { useState, useEffect } from 'react';
// import { getData, setData, Provider } from '../../utils/localStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, Building2, Check, X, Clock, Users } from 'lucide-react';
export interface Provider {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'pending' | 'approved' | 'rejected' | 'disabled';
  joinDate: string;
  productsCount: number;
  servicesCount: number;
}

const ProvidersPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);

  useEffect(() => {
    // const providerData = getData<Provider>('providers');
    const providerData = [];
    setProviders(providerData);
    setFilteredProviders(providerData);
  }, []);

  useEffect(() => {
    const filtered = providers.filter(provider =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProviders(filtered);
  }, [searchTerm, providers]);

  const updateProviderStatus = (providerId: string, status: Provider['status']) => {
    const updatedProviders = providers.map(provider => {
      if (provider.id === providerId) {
        toast({
          title: "Provider Status Updated",
          description: `${provider.name} has been ${status}`,
        });
        return { ...provider, status };
      }
      return provider;
    });

    setProviders(updatedProviders);
    // setData('providers', updatedProviders);
  };

  const getStatusBadge = (status: Provider['status']) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <Check className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'disabled':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Disabled
          </Badge>
        );
      default:
        return null;
    }
  };

  const pendingCount = providers.filter(p => p.status === 'pending').length;
  const approvedCount = providers.filter(p => p.status === 'approved').length;
  const rejectedCount = providers.filter(p => p.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Provider Management</h1>
          <p className="text-gray-600 mt-2">Approve and manage service providers</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-yellow-600">{pendingCount} Pending</span> • 
            <span className="font-medium text-green-600 ml-1">{approvedCount} Approved</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Providers</p>
                <p className="text-2xl font-bold text-gray-900">{providers.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <X className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>Search Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Providers List */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>All Providers ({filteredProviders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/20 hover:bg-white/70 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                    {provider.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-600">{provider.company}</p>
                    <p className="text-sm text-gray-600">{provider.email}</p>
                    <p className="text-xs text-gray-500">Joined: {new Date(provider.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right text-sm">
                    <p className="text-gray-700">{provider.productsCount} products</p>
                    <p className="text-gray-700">{provider.servicesCount} services</p>
                  </div>
                  {getStatusBadge(provider.status)}
                  
                  <div className="flex space-x-2">
                    {provider.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateProviderStatus(provider.id, 'approved')}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateProviderStatus(provider.id, 'rejected')}
                          className="hover:bg-red-50 hover:text-red-700 border-red-200"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {provider.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateProviderStatus(provider.id, 'disabled')}
                        className="hover:bg-red-50 hover:text-red-700"
                      >
                        Disable
                      </Button>
                    )}
                    
                    {provider.status === 'disabled' && (
                      <Button
                        size="sm"
                        onClick={() => updateProviderStatus(provider.id, 'approved')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Enable
                      </Button>
                    )}
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

export default ProvidersPage;
