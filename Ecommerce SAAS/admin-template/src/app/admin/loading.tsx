export default function AdminLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-6 py-4">
      <div className="flex flex-col gap-3">
        <div className="h-8 w-56 rounded-full bg-white/10" />
        <div className="h-3 w-80 max-w-full rounded-full bg-white/5" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-28 rounded-3xl border border-white/5 bg-surface" />
        ))}
      </div>
      <div className="h-[360px] rounded-3xl border border-white/5 bg-surface" />
    </div>
  );
}
