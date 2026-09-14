import ShopByCategory from "@/components/shopByCategory/shopByCategory";

const ShopByCategoryPage = async ({ searchParams }) => {
  const params = await searchParams;

  return (
    <div>
      <ShopByCategory initialFit={params?.fit || ""} />
    </div>
  );
};

export default ShopByCategoryPage;
