"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OrderItem {
  item_id: number;
  product_id: number;
  product_name: string;
  product_category: string;
  product_images: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

interface Order {
  order_id: number;
  order_date: string;
  customerName?: string;
  shipping_address: string;
  payment_status: string;
  status: string;
  delivery_charge: string;
  provider_total_amount: number;
  total_amount: string;
  items: OrderItem[];
}

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  open,
  onClose,
}: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order #{order.order_id}</DialogTitle>
          <DialogDescription>
            Placed on {new Date(order.order_date).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        {/* Order Details */}
        <div className="space-y-4">
          <div>
            <p className="font-medium">Customer: {order.customerName || "N/A"}</p>
            <p className="text-sm text-muted-foreground">
              Shipping: {order.shipping_address}
            </p>
            <p className="text-sm text-muted-foreground">
              Payment: {order.payment_status}
            </p>
            <p className="text-sm text-muted-foreground">
              Status: {order.status}
            </p>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <h4 className="font-medium">Items</h4>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.item_id}
                  className="flex items-center gap-4 border-b pb-3 last:border-b-0"
                >
                  <img
                    // src={item.product_images}
                     src={`http://localhost/Git/Project1/Backend/${item.product_images}`}
                    alt={item.product_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.product_category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Qty: {item.quantity}</p>
                    <p className="text-sm">Unit: Rs.{item.unit_price}</p>
                    <p className="font-medium">Rs.{item.subtotal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs.{order.provider_total_amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>Rs.{order.delivery_charge}</span>
            </div>
            <div className="flex justify-between font-medium text-lg">
              <span>Total:</span>
              <span>Rs.{order.total_amount}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
