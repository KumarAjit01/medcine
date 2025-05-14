
'use client';

import { mockOrders, type Order } from '@/lib/mockData';
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
import { Button } from '@/components/ui/button';
import { ListOrdered, Eye, CheckCircle, XCircle, RefreshCw, Truck, Hourglass } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminOrdersPage() {
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600"><Hourglass className="mr-1 h-3 w-3" />{status}</Badge>;
      case 'Processing':
        return <Badge variant="secondary"><RefreshCw className="mr-1 h-3 w-3 animate-spin" />{status}</Badge>;
      case 'Shipped':
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600"><Truck className="mr-1 h-3 w-3" />{status}</Badge>;
      case 'Delivered':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700"><CheckCircle className="mr-1 h-3 w-3" />{status}</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <PageTitle title="Manage Orders" subtitle="View and track all customer orders." icon={ListOrdered} />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>A total of {mockOrders.length} orders found.</CardDescription>
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
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{format(new Date(order.orderDate), 'PPp')}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">{order.itemCount}</TableCell>
                    <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline" size="sm" disabled> {/* TODO: Implement view details */}
                        <Eye className="mr-1 h-4 w-4" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {mockOrders.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No orders found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
