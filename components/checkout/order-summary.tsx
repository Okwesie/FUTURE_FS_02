"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Truck, CreditCard, Package } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"

export function OrderSummary() {
  const { items, totals, itemCount } = useCart()
  const router = useRouter()

  const freeShippingRemaining = 100 - totals.subtotal

  return (
    <div className="space-y-6">
      {/* Order Summary Card */}
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product._id} className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={item.product.img || `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(item.product.name)}`}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
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
              <span>Subtotal ({itemCount} items)</span>
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

          {freeShippingRemaining > 0 && freeShippingRemaining <= 100 && (
            <div className="p-3 bg-accent/10 rounded-lg">
              <p className="text-sm text-accent-foreground">
                Add <span className="font-medium">${freeShippingRemaining.toFixed(2)}</span> more for free shipping!
              </p>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${totals.grandTotal.toFixed(2)}</span>
          </div>

          {/* Payment Info */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4" />
              <span className="font-medium text-sm">Payment Method</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This is a demo checkout. No real payment will be processed. Your order will be marked as paid automatically.
            </p>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">
              🔒 Secure Checkout
            </Badge>
            <span>Your information is safe and encrypted</span>
          </div>
        </CardContent>
      </Card>

      {/* Continue Shopping */}
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={() => router.push("/")}
      >
        Continue Shopping
      </Button>
    </div>
  )
}