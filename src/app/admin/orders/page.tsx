
'use client';

import { useState, useEffect } from 'react';
import { mockOrders as initialMockOrders, type Order, type OrderStatus } from '@/lib/mockData';
import PageTitle from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListOrdered, CheckCircle, XCircle, RefreshCw, Truck, Hourglass, PackageSearch, Send } from 'lucide-react'; // Added PackageSearch for Packing, Send for Out for Delivery
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

const ALL_STATUSES: OrderStatus[] = [
  'Pending',
  'Packing',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export default function AdminOrdersPage() {
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with a deep copy to prevent direct mutation of mockData
    setDisplayedOrders(JSON.parse(JSON.stringify(initialMockOrders)));
  }, []);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600"><Hourglass className="mr-1 h-3 w-3" />{status}</Badge>;
      case 'Packing':
        return <Badge variant="default" className="bg-orange-500 hover:bg-orange-600"><PackageSearch className="mr-1 h-3 w-3" />{status}</Badge>;
      case 'Processing':
        return <Badge variant="secondary"><RefreshCw className="mr-1 h-3 w-3 animate-spin" />{status}</Badge>;
      case 'Shipped':
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600"><Truck className="mr-1 h-3 w-3" />{status}</Badge>;
      case 'Out for Delivery':
        return <Badge variant="default" className="bg-teal-500 hover:bg-teal-600"><Send className="mr-1 h-3 w-3" />{status}</Badge>;
      case 'Delivered':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700"><CheckCircle className="mr-1 h-3 w-3" />{status}</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setDisplayedOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-8">
      <PageTitle title="Manage Orders" subtitle="View, track, and update all customer orders." icon={ListOrdered} />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>A total of {displayedOrders.length} orders found.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center min-w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{format(new Date(order.orderDate), 'PPp')}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">{order.itemCount}</TableCell>
                    <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                       <Select
                        value={order.status}
                        onValueChange={(newStatus: string) => handleStatusChange(order.id, newStatus as OrderStatus)}
                      >
                        <SelectTrigger className="w-full sm:w-[160px] h-9">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_STATUSES.map(statusOption => (
                            <SelectItem key={statusOption} value={statusOption}>
                              {statusOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {displayedOrders.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No orders found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
