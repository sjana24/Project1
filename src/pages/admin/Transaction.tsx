import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  CreditCard,
  DollarSign,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";
import axios from "axios";

// Interface aligned with backend + commission fields
interface Transaction {
  transaction_id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  payment_method: string;
  status: "completed" | "pending" | "failed" | "refunded";
  transaction_date: string;
  order_id: string;
  provider_name: string | null;
  service_name: string | null;
  commission: number;
  profit: number;
  net_amount: number;
}

const TransactionPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  // Fetch data from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          "http://localhost/Git/Project1/Backend/GetAllTransactionAdmin.php",
          { withCredentials: true }
        );

        if (res.data.success) {
  const transformed = res.data.transactions.map((t: any) => {
    const amount = parseFloat(t.amount) || 0; // ensure number
    const commission = amount * 0.1; // 10% commission
    const profit = amount;

    return {
      ...t,
      amount,
      commission,
      profit,
      net_amount: amount - commission,
    };
  });
  setTransactions(transformed);
}

         else {
          toast({
            title: "Error",
            description: res.data.message,
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
      }
    };

    fetchTransactions();
  }, []);

  // Search + filter
  // useEffect(() => {
  //   let filtered = transactions.filter(
  //     (transaction) =>
  //       transaction.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       transaction.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       transaction.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       transaction.order_id?.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  //   if (statusFilter !== "all") {
  //     filtered = filtered.filter((transaction) => transaction.status === statusFilter);
  //   }

  //   setFilteredTransactions(filtered);
  // }, [searchTerm, statusFilter, transactions]);
  // Search + filter
useEffect(() => {
  let filtered = transactions.filter((transaction) => {
    const term = searchTerm.toLowerCase();

    return (
      (transaction.customer_name?.toLowerCase() || "").includes(term) ||
      (transaction.customer_email?.toLowerCase() || "").includes(term) ||
      (transaction.transaction_id?.toLowerCase() || "").includes(term) ||
      (transaction.order_id?.toLowerCase() || "").includes(term)
    );
  });

  if (statusFilter !== "all") {
    filtered = filtered.filter((transaction) => transaction.status === statusFilter);
  }

  setFilteredTransactions(filtered);
}, [searchTerm, statusFilter, transactions]);


  // Badge generator
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            <XCircle className="w-3 h-3 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);

  // Stats
// Stats
const totalAmount = transactions
  .filter((t) => t.status === "completed")
  .reduce((sum, t) => sum + (t.profit || 0), 0);

const totalCommission = transactions
  .filter((t) => t.status === "completed")
  .reduce((sum, t) => sum + (t.commission || 0), 0);


  const completedTransactions = transactions.filter((t) => t.status === "completed").length;
  const pendingTransactions = transactions.filter((t) => t.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction Details</h1>
          <p className="text-gray-600 mt-2">Monitor and manage customer payment transactions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Commission Earned (10%)</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalCommission)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTransactions}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingTransactions}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>Search & Filter Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by customer, email, transaction ID, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-300 bg-white/50 text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.transaction_id}
                className="p-4 bg-white/50 rounded-lg border border-white/20 hover:bg-white/70 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {transaction.customer_name}
                        </h3>
                        <p className="text-sm text-gray-600">{transaction.customer_email}</p>
                        <p className="text-xs text-gray-500">
                          Transaction ID: {transaction.transaction_id}
                        </p>
                        <p className="text-xs text-gray-500">Order ID: {transaction.order_id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-500">{transaction.payment_method}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Provider:</p>
                        <p className="font-medium">{transaction.provider_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Service:</p>
                        <p className="font-medium">
                          {transaction.service_name ?? "Product Order"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Date:</p>
                        <p className="font-medium">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 ml-4">
                    {getStatusBadge(transaction.status)}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Transaction Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Transaction ID:</p>
                              <p className="font-medium">{transaction.transaction_id}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Order ID:</p>
                              <p className="font-medium">{transaction.order_id}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Amount:</p>
                              <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Commission (10%):</p>
                              <p className="font-medium">
                                {formatCurrency(transaction.commission)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Net Amount:</p>
                              <p className="font-medium">
                                {formatCurrency(transaction.net_amount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Payment Method:</p>
                              <p className="font-medium">{transaction.payment_method}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Status:</p>
                              {getStatusBadge(transaction.status)}
                            </div>
                            <div>
                              <p className="text-gray-600">Date:</p>
                              <p className="font-medium">
                                {new Date(transaction.transaction_date).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <p className="text-gray-600 text-sm">Customer:</p>
                            <p className="font-medium">{transaction.customer_name}</p>
                            <p className="text-sm text-gray-600">{transaction.customer_email}</p>
                          </div>

                          <div className="border-t pt-4">
                            <p className="text-gray-600 text-sm">Service Details:</p>
                            <p className="font-medium">
                              {transaction.service_name ?? "Product Order"}
                            </p>
                            <p className="text-sm text-gray-600">
                              by {transaction.provider_name}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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

export default TransactionPage;
