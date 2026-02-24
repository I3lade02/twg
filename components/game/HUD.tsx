"use client";

export default function HUD({
    score,
    coins,
    multiplier,
    gameOver,
    onRestart,
}: {
    score: number;
    coins: number;
    multiplier: number;
    gameOver: boolean;
    onRestart: () => void;
}) {
    return (
        <div className="pointer-events-none fixed inset-0 p-4">
            <div className="pointer-events-auto inline-flex items-start gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 backdrop-blur">
                    <div className="text-xs uppercase tracking-wider text-slate-400">Score</div>
                    <div className="text-2xl font-semibold tabular-nums">{score}</div>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2">
                            <div className="text-xs text-slate-400">Coins</div>
                            <div className="font-semibold tabular-nums">{coins}</div>
                        </div>
                    
                        <div className="rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2">
                            <div className="text-xs text-slate-400">Multiplier</div>
                            <div className="font-semibold tabular-nums">x{multiplier}</div>
                        </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-400">
                        Controls: arrows(move) * Space (jump) * R restart
                    </div>
                </div>

                {gameOver && (
                    <div className="rounded-2xl border border-rose-900/60 bg-roses-950/40 px-4 py-3 backdrop-blur">
                        <div className="text-sm font-semibold text-rose-200">Crash!</div>
                        <button
                            onClick={onRestart}
                            className="mt-2 rounded-xl bg-rose-500 px-3 py-1.5 text-sm font-medium text-slate-950 hover:bg-rose-400 active:bg-rose-600"
                        >
                            Restart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}