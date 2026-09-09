import { notFound } from "next/navigation";

// Components Import
import ProductGallery from "@/components/product-detail/ProductGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import CategoryReviews from "@/components/product-detail/CategoryReviews";
import ProductFaq from "@/components/product-detail/ProductFaq";

// Fetcher Function
async function getProductBySlug(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Fetch product error:", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // 1. Fetch from Backend / API
  const productData = await getProductBySlug(slug);

  // 2. Fallback check: If API fails, show 404
  if (!productData) {
    notFound();
  }

  // 3. Normalize arrays safely
  const images = Array.isArray(productData.images) 
    ? productData.images 
    : [productData.images || "/placeholder.jpg"];

  const sizes = Array.isArray(productData.sizes) 
    ? productData.sizes 
    : ["S", "M", "L", "XL"];

  const product = {
    ...productData,
    images,
    sizes,
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Top Grid (Gallery + Info) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <ProductGallery 
              images={product.images} 
              title={product.title} 
              fitTag={product.fitTag} 
            />
          </div>
          <div className="lg:col-span-5">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Section 3: Reviews */}
        <CategoryReviews />

        {/* Section 4: FAQ */}
        <ProductFaq />
      </div>
    </div>
  );
}