// app/game/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { RunnerGame } from "@/lib/game/RunnerGame";
import HUD from "@/components/game/HUD";

export default function GamePage() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<RunnerGame | null>(null);

  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
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

    // Poll HUD state from game (simple + robust)
    const hudTimer = window.setInterval(() => {
      const s = game.getHUDState();
      setCoins(s.coins);
      setMultiplier(s.multiplier);
    }, 50);

    return () => {
      window.clearInterval(hudTimer);
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
        coins={coins}
        multiplier={multiplier}
        gameOver={gameOver}
        onRestart={() => {
          setScore(0);
          setCoins(0);
          setMultiplier(1);
          setGameOver(false);
          gameRef.current?.restart();
        }}
      />
    </main>
  );
}