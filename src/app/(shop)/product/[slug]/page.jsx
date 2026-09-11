import { notFound } from "next/navigation";

import ProductGallery from "@/components/product-detail/ProductGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import CategoryReviews from "@/components/product-detail/CategoryReviews";
import ProductFaq from "@/components/product-detail/ProductFaq";

async function getProductBySlug(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`API response failed with status: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Fetch product error:", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const productData = await getProductBySlug(slug);

  if (!productData) {
    notFound();
  }

  const images = Array.isArray(productData.images) && productData.images.length > 0
    ? productData.images
    : [productData.images || "/placeholder.jpg"];

  const sizes = Array.isArray(productData.availableSizes) && productData.availableSizes.length > 0
    ? productData.availableSizes
    : Array.isArray(productData.sizes)
    ? productData.sizes
    : ["S", "M", "L", "XL"];

  const product = {
    ...productData,
    price: Number(productData.price),
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
    images,
    sizes,
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
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

        <CategoryReviews />
        <ProductFaq />
      </div>
    </div>
  );
}