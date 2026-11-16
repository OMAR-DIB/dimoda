import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAppDispatch } from './store/hooks'
import { loadCatalog } from './store/catalogSlice'
import { AnnouncementBar } from './components/layout/AnnouncementBar'
import { Header } from './components/layout/Header'
import { MobileMenu } from './components/layout/MobileMenu'
import { SearchOverlay } from './components/layout/SearchOverlay'
import { Footer } from './components/layout/Footer'
import { WhatsAppFab } from './components/layout/WhatsAppFab'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { CartDrawer } from './components/cart/CartDrawer'
import { Toaster } from './components/ui/Toaster'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Wishlist from './pages/Wishlist'
import About from './pages/About'
import NotFound from './pages/NotFound'

export default function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(loadCatalog())
  }, [dispatch])

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:gender" element={<Shop />} />
          <Route path="/shop/:gender/:category" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/success" element={<OrderSuccess />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFab />
      <Toaster />
    </div>
  )
}
