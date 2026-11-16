import type { Category } from '../types'

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const categories: Category[] = [
  // Women
  { slug: 'dresses', name: 'Dresses', gender: 'women', image: u('photo-1595777457583-95e059d581b8') },
  { slug: 'tops', name: 'Tops & Blouses', gender: 'women', image: u('photo-1516762689617-e1cffcef479d') },
  { slug: 'blazers', name: 'Blazers', gender: 'women', image: u('photo-1591369822096-ffd140ec948f') },
  { slug: 'skirts', name: 'Skirts', gender: 'women', image: u('photo-1583496661160-fb5886a0aaaa') },
  { slug: 'denim-w', name: 'Denim', gender: 'women', image: u('photo-1594633312681-425c7b97ccd1') },
  { slug: 'outerwear-w', name: 'Coats & Jackets', gender: 'women', image: u('photo-1572804013309-59a88b7e92f1') },
  { slug: 'bags', name: 'Bags', gender: 'women', image: u('photo-1548036328-c9fa89d128fa') },
  { slug: 'shoes-w', name: 'Shoes', gender: 'women', image: u('photo-1543163521-1bf539c55dd2') },
  // Men
  { slug: 'shirts', name: 'Shirts', gender: 'men', image: u('photo-1602810318383-e386cc2a3ccf') },
  { slug: 'tees', name: 'T-Shirts & Polos', gender: 'men', image: u('photo-1617137968427-85924c800a22') },
  { slug: 'suits', name: 'Suits & Blazers', gender: 'men', image: u('photo-1594938298603-c8148c4b4a8c') },
  { slug: 'knitwear', name: 'Knitwear & Hoodies', gender: 'men', image: u('photo-1556821840-3a63f95609a7') },
  { slug: 'denim-m', name: 'Denim & Trousers', gender: 'men', image: u('photo-1542272604-787c3835535d') },
  { slug: 'outerwear-m', name: 'Jackets', gender: 'men', image: u('photo-1551028719-00167b16eac5') },
  { slug: 'shoes-m', name: 'Shoes', gender: 'men', image: u('photo-1549298916-b41d501d3772') },
]

export const categoriesByGender = (gender: 'women' | 'men') =>
  categories.filter((c) => c.gender === gender)

export const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug
