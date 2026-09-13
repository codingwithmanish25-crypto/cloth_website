export default function ShopByCategoryLoading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
      <div className="mb-6 h-10 animate-pulse border-b border-zinc-800" />
      <div className="flex gap-8">
        <div className="hidden h-[520px] w-72 animate-pulse bg-zinc-900 lg:block" />
        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 md:gap-6">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[3/4] bg-zinc-900" />
              <div className="mt-3 h-3 w-4/5 bg-zinc-900" />
              <div className="mt-2 h-3 w-2/5 bg-zinc-900" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}