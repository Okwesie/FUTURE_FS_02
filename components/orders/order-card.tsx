"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Package, ChevronDown, ChevronUp, Eye, Truck, CreditCard } from "lucide-react"

interface Order {
  _id: string
  items: Array<{
    productId: string
    name: string
    price: number
    qty: number
  }>
  totals: {
    subtotal: number
    tax: number
    shipping: number
    grandTotal: number
    currency: string
  }
  shipping: {
    fullName: string
    address: string
    city: string
    country: string
    phone: string
  }
  payment: {
    method: string
    status: string
    reference: string
  }
  status: string
  createdAt: string
}

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5" />
              Order #{order._id.slice(-8).toUpperCase()}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/checkout/success?orderId=${order._id}`}>
                <Eye className="w-4 h-4 mr-1" />
                View
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
              <p className="font-semibold">${order.totals.grandTotal.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Payment</p>
              <p className="font-medium capitalize">{order.payment.method}</p>
            </div>
          </div>

          {/* Collapsible Details */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <span className="text-sm font-medium">{isOpen ? "Hide" : "Show"} order details</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              {/* Items */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Items Ordered</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${item.price} × {item.qty}
                      </p>
                    </div>
                    <span className="font-medium text-sm">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${order.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${order.totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{order.totals.shipping === 0 ? "Free" : `$${order.totals.shipping.toFixed(2)}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              {/* Shipping & Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Shipping Address
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{order.shipping.fullName}</p>
                    <p>{order.shipping.address}</p>
                    <p>
                      {order.shipping.city}, {order.shipping.country}
                    </p>
                    <p>{order.shipping.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    Payment Details
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="capitalize">{order.payment.method} Payment</p>
                    <p>Status: {order.payment.status}</p>
                    <p>Ref: {order.payment.reference}</p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  )
}
