import { createRoot } from 'react-dom/client'
import './assets/css/style.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { CurrencyProvider } from './context/CurrencyContext.tsx'
import { WishlistProvider } from './context/WishlistContext.tsx'
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { CartProvider } from './context/CartContext.tsx'

createRoot(document.getElementById('root')!).render(
  <WishlistProvider>
    <AuthProvider>
  <CurrencyProvider>
  <CartProvider>
    <Toaster position="bottom-center" reverseOrder={false} />
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </CartProvider>
  </CurrencyProvider>
  </AuthProvider>
  </WishlistProvider>,
)
