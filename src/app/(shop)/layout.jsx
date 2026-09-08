import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Cart from "@/components/cart";
import { CartProvider } from "@/context/CartContext";

export default function ShopLayout({ children }) {
  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <Cart />
    </CartProvider>
  );
}