import BlinkLoader from "@/components/BlinkLoader";

export default function ProductLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-black text-white">
      <BlinkLoader label="Loading product..." />
    </div>
  );
}