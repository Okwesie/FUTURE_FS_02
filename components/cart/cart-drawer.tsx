"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { CartItemComponent } from "./cart-item"
import { CartSummary } from "./cart-summary"

interface CartDrawerProps {
  onCheckout?: () => void
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { items, itemCount, isOpen, closeCart, toggleCart } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? null : closeCart())}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative" onClick={toggleCart}>
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Add some products to get started</p>
              <Button onClick={closeCart}>Continue Shopping</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-0">
                {items.map((item) => (
                  <CartItemComponent key={item.product._id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 mt-4">
              <CartSummary onCheckout={onCheckout} />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
