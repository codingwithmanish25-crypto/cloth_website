import ShopByCategory from '@/components/shopByCategory/shopByCategory';
import React from 'react';

const DynamicCategory = async ({ params }) => {
  const { slug } = await params; // Next.js 15+ Async params support

  return (
    <div>
      <ShopByCategory />
    </div>
  );
};

export default DynamicCategory;