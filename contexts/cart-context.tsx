"use client"

import React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface Product {
  id: number
  name: string
  price: number
  category: string
  rating: number
  stock: number
  img?: string
  description?: string
}

interface CartItem {
  product: Product
  quantity: number
}

interface CartTotals {
  subtotal: number
  tax: number
  shipping: number
  grandTotal: number
}

interface CartContextType {
  items: CartItem[]
  totals: CartTotals
  itemCount: number
  isOpen: boolean
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const TAX_RATE = 0.07 // 7% tax rate
const FREE_SHIPPING_THRESHOLD = 100
const SHIPPING_COST = 6.99

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shopping_cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("shopping_cart", JSON.stringify(items))
  }, [items])

  // Calculate totals
  const totals: CartTotals = React.useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const tax = Number((subtotal * TAX_RATE).toFixed(2))
    const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const grandTotal = Number((subtotal + tax + shipping).toFixed(2))

    return { subtotal, tax, shipping, grandTotal }
  }, [items])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const addItem = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        // Update quantity, but don't exceed stock
        const newQuantity = Math.min(existingItem.quantity + quantity, product.stock)
        return prevItems.map((item) => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item))
      } else {
        // Add new item
        const newQuantity = Math.min(quantity, product.stock)
        return [...prevItems, { product, quantity: newQuantity }]
      }
    })
  }

  const removeItem = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId) {
          // Don't exceed stock
          const newQuantity = Math.min(quantity, item.product.stock)
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen(!isOpen)

  return (
    <CartContext.Provider
      value={{
        items,
        totals,
        itemCount,
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
