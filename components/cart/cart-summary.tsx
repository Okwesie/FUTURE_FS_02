"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Truck } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface CartSummaryProps {
  onCheckout?: () => void
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
  const { totals, itemCount } = useCart()

  const freeShippingRemaining = 100 - totals.subtotal

  return (
    <div className="space-y-4">
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

      <Button onClick={onCheckout} className="w-full" size="lg" disabled={itemCount === 0}>
        Proceed to Checkout
      </Button>
    </div>
  )
}
