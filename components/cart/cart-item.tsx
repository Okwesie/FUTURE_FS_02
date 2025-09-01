"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface CartItem {
  product: {
    _id: string
    name: string
    price: number
    category: string
    rating: number
    stock: number
    img?: string
    description?: string
  }
  quantity: number
}

interface CartItemProps {
  item: CartItem
}

export function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.product._id, newQuantity)
  }

  const handleRemove = () => {
    removeItem(item.product._id)
  }

  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
        <Image
          src={item.product.img || `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(item.product.name)}`}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
        <p className="text-sm text-muted-foreground">${item.product.price}</p>
        <p className="text-xs text-muted-foreground">{item.product.stock} in stock</p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 bg-transparent"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="w-3 h-3" />
        </Button>

        <Input
          type="number"
          min="1"
          max={item.product.stock}
          value={item.quantity}
          onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
          className="w-16 text-center text-sm"
        />

        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 bg-transparent"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= item.product.stock}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      <div className="text-right">
        <p className="font-medium text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
        <Button variant="ghost" size="sm" onClick={handleRemove} className="text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
