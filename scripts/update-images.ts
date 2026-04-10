import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Local image filenames — place files in /public/images/products/
const IMAGE_MAP: Record<string, string> = {
  '0001': 'minimalist-niacinamide-serum.jpg',
  '0002': 'minimalist-vitamin-c-serum.jpg',
  '0003': 'dot-and-key-watermelon-moisturiser.jpg',
  '0004': 'ponds-light-gel-moisturiser.jpg',
  '0005': 'mamaearth-ubtan-face-wash.jpg',
  '0006': 'cetaphil-gentle-cleanser.jpg',
  '0007': 'reequil-sunscreen.jpg',
  '0008': 'lakme-sun-expert-sunscreen.jpg',
  '0009': 'plum-green-tea-toner.jpg',
  '0010': 'the-ordinary-eye-cream.jpg',
  '0011': 'the-ordinary-ha-serum.jpg',
  '0012': 'plum-aha-bha-cleanser.jpg',
  '0013': 'maybelline-fit-me-foundation.jpg',
  '0014': 'loreal-true-match-foundation.jpg',
  '0015': 'maybelline-fit-me-concealer.jpg',
  '0016': 'becca-glow-palette.jpg',
  '0017': 'sugar-smudge-me-not-lipstick.jpg',
  '0018': 'lakme-9to5-lip-color.jpg',
  '0019': 'maybelline-sky-high-mascara.jpg',
  '0020': 'myglamm-velvet-love-eyeshadow.jpg',
}

const filePath = join(process.cwd(), 'data/seed/products.json')
const products = JSON.parse(readFileSync(filePath, 'utf-8'))

let updated = 0
for (const product of products) {
  const suffix = product.id.slice(-4)
  const filename = IMAGE_MAP[suffix]
  if (filename) {
    product.image_url = `/images/products/${filename}`
    updated++
  }
}

writeFileSync(filePath, JSON.stringify(products, null, 2))
console.log(`Updated ${updated} product image URLs to local paths`)
