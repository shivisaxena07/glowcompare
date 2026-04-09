import { notFound } from 'next/navigation'
import { Info } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'
import { CategoryTabs } from '@/components/category-tabs'
import { ProductGrid } from '@/components/product-grid'
import type { ProductWithPrices, Category } from '@/src/types'

const VALID_SLUGS: Category[] = ['skincare', 'makeup']

const CATEGORY_LABELS: Record<Category, string> = {
  skincare: 'Skincare',
  makeup: 'Makeup',
}

async function getProductsByCategory(category: Category): Promise<ProductWithPrices[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, platform_prices(*)')
    .eq('category', category)
    .order('trending_score', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error.message)
    return []
  }

  return data as ProductWithPrices[]
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!VALID_SLUGS.includes(slug as Category)) {
    notFound()
  }

  const category = slug as Category
  const products = await getProductsByCategory(category)

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <CategoryTabs />
          <span
            className="flex items-center gap-1 text-xs text-stone-400"
            title="Prices are illustrative. Visit platforms for live prices."
          >
            Sample data — updated weekly
            <Info className="h-3 w-3 shrink-0" />
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-stone-900">{CATEGORY_LABELS[category]}</h2>
          <p className="mt-0.5 text-sm text-stone-500">{products.length} products</p>
        </div>

        <ProductGrid products={products} category={category} />
      </div>
    </main>
  )
}
