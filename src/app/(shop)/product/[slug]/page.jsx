import { notFound } from "next/navigation";
import { headers } from "next/headers";

import ProductGallery from "@/components/product-detail/ProductGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import CategoryReviews from "@/components/product-detail/CategoryReviews";
import ProductFaq from "@/components/product-detail/ProductFaq";
import RelatedProducts from "@/components/product-detail/RelatedProducts";

async function getProductBySlug(slug) {
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") || "http";
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
    const baseUrl =
      configuredUrl && !configuredUrl.includes("localhost")
        ? configuredUrl
        : `${protocol}://${host}`;
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

async function getSuggestedProducts(currentProduct) {
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") || "http";
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
    const baseUrl =
      configuredUrl && !configuredUrl.includes("localhost")
        ? configuredUrl
        : `${protocol}://${host}`;
    const response = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const products = await response.json();
    if (!Array.isArray(products)) return [];

    const availableProducts = products.filter(
      (item) =>
        String(item.id) !== String(currentProduct.id) &&
        !item.isSoldOut &&
        Number(item.stock) > 0,
    );
    const categorySlug = currentProduct.category?.slug;
    const sameCategory = categorySlug
      ? availableProducts.filter((item) => item.category?.slug === categorySlug)
      : [];
    const remaining = availableProducts.filter(
      (item) =>
        !sameCategory.some((related) => String(related.id) === String(item.id)),
    );
    return [...sameCategory, ...remaining];
  } catch (error) {
    console.error("Fetch suggested products error:", error);
    return [];
  }
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const productData = await getProductBySlug(slug);

  if (!productData) {
    notFound();
  }

  const suggestedProducts = await getSuggestedProducts(productData);

  const images =
    Array.isArray(productData.images) && productData.images.length > 0
      ? productData.images
      : [productData.images || "/placeholder.jpg"];

  const sizes =
    Array.isArray(productData.availableSizes) &&
    productData.availableSizes.length > 0
      ? productData.availableSizes
      : Array.isArray(productData.sizes)
        ? productData.sizes
        : ["S", "M", "L", "XL"];

  const product = {
    ...productData,
    price: Number(productData.price),
    originalPrice: productData.originalPrice
      ? Number(productData.originalPrice)
      : null,
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

        <RelatedProducts
          products={suggestedProducts}
          categoryName={product.category?.name || "These Styles"}
          initialLimit={5}
        />
        <CategoryReviews productSlug={product.slug} />
        <ProductFaq />
      </div>
    </div>
  );
}
