export default function Header() {
  
  return (
    <header className="flex items-center justify-between border-b border-[#EDE8DF]/10 bg-[#0B0F14]/80 px-8 py-5 backdrop-blur">
      <div>
        <p className="font-mono-ui text-xs tracking-[0.2em] text-[#8B93A1]">
          WELCOME BACK
        </p>

        <h2 className="font-display mt-1.5 text-xl font-semibold text-[#EDE8DF]">
          Build your career with clarity.
        </h2>
      </div>

      <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#E8A33D] bg-[#E8A33D]/10 text-sm font-semibold text-[#E8A33D]">
        N
        <span
          aria-hidden
          className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0B0F14] bg-[#8FB996]"
        />
      </div>
    </header>
  );
}