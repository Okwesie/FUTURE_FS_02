import { Header } from "@/components/layout/header"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductGrid } from "@/components/products/product-grid"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Discover Amazing Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse our curated collection of high-quality products across multiple categories
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid />
          </div>
        </div>
      </main>
    </div>
  )
}
