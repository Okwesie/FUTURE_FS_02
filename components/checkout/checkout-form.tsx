"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Truck, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface CheckoutFormProps {
  disabled?: boolean
}

interface ShippingInfo {
  fullName: string
  address: string
  city: string
  country: string
  phone: string
}

interface PaymentInfo {
  method: "card" | "cash"
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export function CheckoutForm({ disabled = false }: CheckoutFormProps) {
  const { user, token } = useAuth()
  const { items, totals, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: user?.name || "",
    address: "",
    city: "",
    country: "US",
    phone: "",
  })
  const [payment, setPayment] = useState<PaymentInfo>({
    method: "card",
  })

  const handleShippingChange = (field: keyof ShippingInfo, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !token) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your purchase.",
        variant: "destructive",
      })
      return
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    // Validate required fields
    const requiredFields = ["fullName", "address", "city", "country", "phone"]
    const missingFields = requiredFields.filter((field) => !shipping[field as keyof ShippingInfo])

    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required shipping fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare checkout data
      const checkoutData = {
        items: items.map((item) => ({
          productId: item.product._id,
          qty: item.quantity,
        })),
        shipping,
        payment,
        clientTotal: totals.grandTotal,
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(checkoutData),
      })

      const data = await response.json()

      if (!data.ok) {
        throw new Error(data.error?.message || "Checkout failed")
      }

      // Success! Clear cart and redirect to success page
      clearCart()
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. You will receive a confirmation email shortly.",
      })

      // Redirect to order success page with order ID
      router.push(`/checkout/success?orderId=${data.data._id}`)
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An error occurred during checkout",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={shipping.fullName}
                onChange={(e) => handleShippingChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                disabled={disabled}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={shipping.phone}
                onChange={(e) => handleShippingChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                disabled={disabled}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={shipping.address}
              onChange={(e) => handleShippingChange("address", e.target.value)}
              placeholder="Enter your street address"
              disabled={disabled}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={shipping.city}
                onChange={(e) => handleShippingChange("city", e.target.value)}
                placeholder="Enter your city"
                disabled={disabled}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Select
                value={shipping.country}
                onValueChange={(value) => handleShippingChange("country", value)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="GH">Ghana</SelectItem>
                  <SelectItem value="NG">Nigeria</SelectItem>
                  <SelectItem value="KE">Kenya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={payment.method}
            onValueChange={(value: "card" | "cash") => setPayment({ method: value })}
            disabled={disabled}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Credit Card (Simulated)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash">Cash on Delivery</Label>
            </div>
          </RadioGroup>

          {payment.method === "card" && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                This is a demo checkout. No real payment will be processed. Your order will be marked as paid
                automatically.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full" disabled={disabled || isLoading}>
        {isLoading ? "Processing..." : `Place Order - $${totals.grandTotal.toFixed(2)}`}
      </Button>
    </form>
  )
}
