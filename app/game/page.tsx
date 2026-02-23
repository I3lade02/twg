"use client";

import { useEffect, useRef, useState } from "react";
import { RunnerGame } from "@/lib/game/RunnerGame";
import HUD from "@/components/game/HUD";

export default function GamePage() {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const gameRef = useRef<RunnerGame | null>(null);

    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        const game = new RunnerGame({
            host,
            onScoreChange: setScore,
            onGameOver: () => setGameOver(true),
        });

        gameRef.current = game;
        game.start();

        return () => {
            game.stop();
            game.dispose();
            gameRef.current = null;
        };
    }, []);

    return (
        <main className="min-h-dvh bg-slate-950 text-slate-100">
            <div ref={hostRef} className="fixed inset-0" />

            <HUD
                score={score}
                gameOver={gameOver}
                onRestart={() => {
                    setScore(0);
                    setGameOver(false);
                    gameRef.current?.restart();
                }}
            />
        </main>
    );
}