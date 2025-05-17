
'use client';

import { useState, useEffect, useMemo } from 'react';
import { mockOrders, type Order, type OrderStatus } from '@/lib/mockData';
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BarChart3, CalendarIcon, CheckCircle, XCircle, RefreshCw, Truck, Hourglass, PackageSearch, Send, DollarSign, ShoppingBag } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';

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

export default function AdminSalesReportPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const dailyOrders = useMemo(() => {
    if (!selectedDate) return [];
    return mockOrders.filter(order => isSameDay(parseISO(order.orderDate), selectedDate));
  }, [selectedDate]);

  const totalSales = useMemo(() => {
    return dailyOrders.reduce((sum, order) => sum + (order.status !== 'Cancelled' ? order.totalAmount : 0), 0);
  }, [dailyOrders]);

  const totalOrderCount = useMemo(() => {
    return dailyOrders.filter(order => order.status !== 'Cancelled').length;
  }, [dailyOrders]);

  return (
    <div className="space-y-8">
      <PageTitle title="Daily Sales Report" subtitle="View sales and order summaries for a selected date." icon={BarChart3} />
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Select Report Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {selectedDate && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales Amount</CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  For {format(selectedDate, "PPP")}
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrderCount}</div>
                <p className="text-xs text-muted-foreground">
                  (Excluding cancelled orders)
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Orders for {format(selectedDate, "PPP")}</CardTitle>
              <CardDescription>A list of orders placed on the selected date.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyOrders.length > 0 ? (
                      dailyOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-right">{order.itemCount}</TableCell>
                          <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No orders found for {format(selectedDate, "PPP")}.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
