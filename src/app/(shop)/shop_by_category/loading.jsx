import BlinkLoader from "@/components/BlinkLoader";

export default function ShopByCategoryLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <BlinkLoader label="Loading products..." />
    </div>
  );
}