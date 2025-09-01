"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Product {
  _id: string
  name: string
  price: number
  category: string
  rating: number
  stock: number
  img?: string
  description?: string
}

interface ProductsResponse {
  items: Product[]
  total: number
  page: number
  pages: number
}

interface ProductFilters {
  search: string
  category: string
  minPrice: number
  maxPrice: number
  sort: "name" | "price" | "rating" | "createdAt"
  order: "asc" | "desc"
  page: number
  limit: number
}

interface ProductsContextType {
  products: Product[]
  loading: boolean
  error: string | null
  filters: ProductFilters
  totalPages: number
  totalProducts: number
  categories: string[]
  updateFilters: (newFilters: Partial<ProductFilters>) => void
  resetFilters: () => void
  fetchProducts: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

const defaultFilters: ProductFilters = {
  search: "",
  category: "All",
  minPrice: 0,
  maxPrice: 1000,
  sort: "createdAt",
  order: "desc",
  page: 1,
  limit: 12,
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters)
  const [totalPages, setTotalPages] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [categories, setCategories] = useState<string[]>(["All", "Books", "Electronics", "Apparel", "Home", "Beauty"])

  const buildQueryString = (currentFilters: ProductFilters) => {
    const params = new URLSearchParams()

    if (currentFilters.search) params.append("search", currentFilters.search)
    if (currentFilters.category !== "All") params.append("category", currentFilters.category)
    if (currentFilters.minPrice > 0) params.append("minPrice", currentFilters.minPrice.toString())
    if (currentFilters.maxPrice < 1000) params.append("maxPrice", currentFilters.maxPrice.toString())
    params.append("sort", currentFilters.sort)
    params.append("order", currentFilters.order)
    params.append("page", currentFilters.page.toString())
    params.append("limit", currentFilters.limit.toString())

    return params.toString()
  }

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)

    try {
      const queryString = buildQueryString(filters)
      const response = await fetch(`${API_BASE_URL}/api/products?${queryString}`)
      const data = await response.json()

      if (!data.ok) {
        throw new Error(data.error?.message || "Failed to fetch products")
      }

      const productsData: ProductsResponse = data.data
      setProducts(productsData.items)
      setTotalPages(productsData.pages)
      setTotalProducts(productsData.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except when changing page)
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts()
  }, [filters])

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        filters,
        totalPages,
        totalProducts,
        categories,
        updateFilters,
        resetFilters,
        fetchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
