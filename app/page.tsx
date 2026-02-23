import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-slate-950 text-slate-100 grid place-items-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
        <h1 className="text-2xl font-semibold tracking-tight">Three runner</h1>
        <p className="mt-2 text-slate-300">
          Procedural 3D endless runner built with Next.js, TypeScript, Tailwind, and Three.js
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/game"
            className="rounded-xl bg-emerald-500 px-4 py-2 font-medium text-slate-950 hover:bg-emerald-400 active:bg-emerald-600"
          >
            Play
          </Link>

          <a
            href="https://threejs.org/"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-700 px-4 py-2 font-medium text-slate-100 hover:bg-slate-800"
          >
            Three.js Docs
          </a>
        </div>

        <div className="mt-6 text-sm text-slate-400">
          Controls: arrows (movement), Space (jumo), R restart
        </div>
      </div>
    </main>
  );
}