import { notFound } from "next/navigation";

// Components Import
import ProductGallery from "@/components/product-detail/ProductGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import CategoryReviews from "@/components/product-detail/CategoryReviews";
import ProductFaq from "@/components/product-detail/ProductFaq";

// Demo Data
const productsData = [
  {
    id: 1,
    title: "EMPEROR RELAXED FIT T-SHIRT",
    price: 1599,
    originalPrice: 1999,
    fitTag: "RELAXED FIT",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp",
      "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp",
      "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp",
    ],
    slug: "the-glory-arc-relaxed-fit",
    description: "High quality relaxed fit t-shirt made with 100% premium cotton.",
  },
  {
    id: 2,
    title: "SKY WALKER NAVY OVERSIZED T-SHIRT",
    price: 1599,
    originalPrice: 1999,
    fitTag: "OVERSIZED FIT",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp",
    ],
    slug: "sky-walker-navy-oversized",
    description: "Trendy oversized fit t-shirt perfect for streetwear style.",
  },
];

export default async function ProductDetailPage({ params }) {
  // Await params for Next.js 15 compatibility
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const product = productsData.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Section 1 & 2: Top Grid (Gallery + Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <ProductGallery 
              images={product.images || []} 
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