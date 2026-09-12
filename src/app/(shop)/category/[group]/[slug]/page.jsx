import ShopByCategory from "@/components/shopByCategory/shopByCategory";
import React from "react";

const DynamicDepartmentCategory = async ({ params }) => {
  const { group, slug } = await params;
  const categorySlug = `${decodeURIComponent(group)}-${decodeURIComponent(slug)}`;

  return <ShopByCategory initialCategory={categorySlug} />;
};

export default DynamicDepartmentCategory;