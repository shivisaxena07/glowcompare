export type Category = 'skincare' | 'makeup'

export type Platform = 'nykaa' | 'tira' | 'amazon' | 'flipkart' | 'purplle'

export type SubCategory =
  | 'cleanser'
  | 'moisturiser'
  | 'serum'
  | 'sunscreen'
  | 'toner'
  | 'eye_cream'
  | 'foundation'
  | 'concealer'
  | 'blush'
  | 'lipstick'
  | 'mascara'
  | 'eyeshadow'

export interface Product {
  id: string
  name: string
  brand: string
  category: Category
  sub_category: SubCategory
  description: string
  image_url: string
  ingredients_summary: string
  trending_score: number
  created_at: string
}

export interface PlatformPrice {
  id: string
  product_id: string
  platform: Platform
  price: number
  original_price: number
  discount_pct: number
  url: string
  availability: boolean
  last_updated: string
}

export interface TrendingSignals {
  id: string
  product_id: string
  social_score: number
  bestseller_score: number
  rating_score: number
  search_score: number
  editorial_score: number
  composite_score: number
  updated_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  alert_price: number | null
  alert_active: boolean
  created_at: string
}

// Enriched types used in the UI (joins)
export interface ProductWithPrices extends Product {
  platform_prices: PlatformPrice[]
}

export interface ProductWithAll extends Product {
  platform_prices: PlatformPrice[]
  trending_signals: TrendingSignals[]  // Supabase returns joined rows as array
}
