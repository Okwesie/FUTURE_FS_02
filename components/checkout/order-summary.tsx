"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Truck } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function OrderSummary() {
  const { items, totals, itemCount } = useCart()

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Order Summary ({itemCount} items)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.product._id} className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={
                    item.product.img ||
                    `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(item.product.name) || "/placeholder.svg"}`
                  }
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                <p className="text-xs text-muted-foreground">
                  ${item.product.price} × {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (7%)</span>
            <span>${totals.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Shipping
            </span>
            <span>{totals.shipping === 0 ? "Free" : `$${totals.shipping.toFixed(2)}`}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${totals.grandTotal.toFixed(2)}</span>
        </div>

        {/* Free Shipping Notice */}
        {totals.shipping === 0 && totals.subtotal >= 100 && (
          <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Free Shipping
            </Badge>
            <span className="text-sm text-muted-foreground">You saved $6.99!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
