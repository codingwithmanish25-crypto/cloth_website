import ShopByCategory from "@/components/shopByCategory/shopByCategory";
import React from "react";

const CollectionPage = async ({ params }) => {
  const { slug } = await params;

  return <ShopByCategory initialCollection={decodeURIComponent(slug)} />;
};

export default CollectionPage;