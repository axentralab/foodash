"use client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left hero panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {["🍔","🍕","🍱","🥗","🍰","🌮","🍜","🥤"].map((e, i) => (
            <span key={i} className="absolute text-5xl opacity-10 select-none"
              style={{ left:`${8+(i%4)*24}%`, top:`${12+Math.floor(i/4)*42}%` }}>{e}</span>
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-2xl">🍽️</div>
            <span className="text-white text-2xl font-bold">FooDash</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-5">
            Delicious food,<br />
            <span className="text-gradient">delivered fast.</span>
          </h1>
          <p className="text-white/60 text-lg max-w-sm leading-relaxed">
            Explore hundreds of restaurants. Fresh, hot, and at your door in minutes.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[["500+","Restaurants"],["30min","Avg Delivery"],["4.8★","App Rating"]].map(([v,l]) => (
            <div key={l} className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/10">
              <div className="text-2xl font-bold text-white">{v}</div>
              <div className="text-white/50 text-sm mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white min-h-screen">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-lg">🍽️</div>
            <span className="text-dark-100 text-xl font-bold">FooDash</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
