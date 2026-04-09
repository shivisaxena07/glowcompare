import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Unsplash photo IDs mapped to each product by ID suffix
// Format: https://images.unsplash.com/photo-[ID]?w=400&h=400&fit=crop&q=80
// All IDs verified 200 via curl against images.unsplash.com
const IMAGE_MAP: Record<string, string> = {
  '0001': '1598440947619-2c35fc9aa908',  // Minimalist Niacinamide — skincare serum bottle
  '0002': '1570554886111-e80fcca6a029',  // Minimalist Vit C — serum / amber tones
  '0003': '1620916566398-39f1143ab7be',  // Dot & Key Watermelon — skincare flatlay
  '0004': '1612817288484-6f916006741a',  // Pond's Light Gel — skincare cream jar
  '0005': '1556228720-195a672e8a03',     // Mamaearth Ubtan — face wash bottle
  '0006': '1601049676869-702ea24cfd58',  // Cetaphil — gentle skincare bottle
  '0007': '1616394584738-fc6e612e71b9',  // Re'equil Sunscreen — skincare products
  '0008': '1504674900247-0877df9cc836',  // Lakme Sun Expert — beauty product
  '0009': '1520923642038-b4259acecbd7',  // Plum Toner — skincare bottle close-up
  '0010': '1556228453-efd6c1ff04f6',     // The Ordinary Eye Cream — skincare cream
  '0011': '1583241475880-083f84372725',  // The Ordinary HA Serum — serum bottle
  '0012': '1599305090598-fe179d501227',  // Plum AHA BHA Cleanser — skincare products
  '0013': '1522335789203-aabd1fc54bc9',  // Maybelline Foundation — makeup products
  '0014': '1596462502278-27bfdc403348',  // L'Oreal True Match — makeup palette
  '0015': '1522337360788-8b13dee7a37e',  // Maybelline Concealer — makeup close-up
  '0016': '1571781926291-c477ebfd024b',  // BECCA Palette — eye makeup palette
  '0017': '1512496015851-a90fb38ba796',  // Sugar Cosmetics Lipstick — lipstick
  '0018': '1543269865-cbf427effbad',     // Lakme Lip Color — beauty / lips
  '0019': '1556228578-0d85b1a4d571',     // Maybelline Mascara — beauty product set
  '0020': '1556228453-efd6c1ff04f6',     // MyGlamm Eyeshadow Palette — makeup (reused)
}

const filePath = join(process.cwd(), 'data/seed/products.json')
const products = JSON.parse(readFileSync(filePath, 'utf-8'))

let updated = 0
for (const product of products) {
  const suffix = product.id.slice(-4)
  const photoId = IMAGE_MAP[suffix]
  if (photoId) {
    product.image_url = `https://images.unsplash.com/photo-${photoId}?w=400&h=400&fit=crop&q=80`
    updated++
  }
}

writeFileSync(filePath, JSON.stringify(products, null, 2))
console.log(`✅ Updated ${updated} product image URLs`)
