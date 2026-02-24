// lib/game/systems/Spawner.ts
import * as THREE from "three";
import { GAME } from "@/lib/game/constants";
import { Chunk } from "@/lib/game/entities/Chunk";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export class Spawner {
  chunks: Chunk[] = [];

  private scene: THREE.Scene;
  private groundMat: THREE.Material;

  private safeLane = 1; // start center

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.groundMat = new THREE.MeshStandardMaterial({ color: 0x1b2a4a, roughness: 1 });
  }

  init() {
    this.disposeAll();

    this.safeLane = 1;

    let z = 0;
    for (let i = 0; i < GAME.CHUNKS_INITIAL; i++) {
      const chunk = new Chunk(this.groundMat);
      chunk.setZ(z);
      this.scene.add(chunk.ground);

      const block = this.planObstaclesForNextChunk();
      chunk.spawnObstacles(this.scene, block);
      this.maybeSpawnCoins(chunk);

      this.chunks.push(chunk);
      z -= GAME.CHUNK_LEN;
    }

    this.sortChunks();
  }

  update(dz: number) {
    for (const chunk of this.chunks) chunk.move(dz);

    // Sort so chunks[0] is the "front" (highest z)
    this.sortChunks();

    // Recycle any chunk that passed the camera threshold
    while (this.chunks.length > 0 && this.chunks[0].getZ() > GAME.CHUNK_RECYCLE_Z) {
      const front = this.chunks.shift()!;
      const last = this.chunks[this.chunks.length - 1];

      front.clearObstacles(this.scene);
      front.clearCoins(this.scene);

      const newZ = last.getZ() - GAME.CHUNK_LEN;
      front.setZ(newZ);

      const block = this.planObstaclesForNextChunk();
      front.spawnObstacles(this.scene, block);

      this.maybeSpawnCoins(front);

      this.chunks.push(front);
      this.sortChunks();
    }
  }

  getAllObstacles() {
    return this.chunks.flatMap((c) => c.obstacles);
  }

  disposeAll() {
    for (const c of this.chunks) {
      c.clearObstacles(this.scene);
      this.scene.remove(c.ground);
      c.dispose();
    }
    this.chunks = [];
  }

  dispose() {
    this.disposeAll();
    this.groundMat.dispose();
  }

  private sortChunks() {
    this.chunks.sort((a, b) => b.getZ() - a.getZ()); // highest z first
  }

  private planObstaclesForNextChunk(): number[] {
    // Chance to have no obstacles at all
    if (Math.random() > GAME.OBSTACLE_SPAWN_CHANCE) {
      this.maybeShiftSafeLane();
      return [];
    }

    // Decide if safe lane shifts (forces player movement but stays fair)
    this.maybeShiftSafeLane();

    const lanes = [0, 1, 2];

    // Always keep safeLane unblocked.
    const blockCandidates = lanes.filter((l) => l !== this.safeLane);

    // Prefer patterns most of the time
    const usePattern = Math.random() < GAME.PATTERN_CHANCE;

    if (usePattern) {
      // Pattern library (fair by design):
      // 1) block one lane (easy)
      // 2) block both non-safe lanes (forces stay on safe lane)
      // 3) occasionally "single block" but in the lane the player likely wants to switch to (still fair)
      const r = Math.random();

      if (r < 0.55) {
        // block one of the non-safe lanes
        return [blockCandidates[Math.floor(Math.random() * blockCandidates.length)]];
      }

      // block both non-safe lanes (harder but always possible)
      return blockCandidates;
    }

    // Fallback random but fair:
    // block 1..max from candidates (never all 3)
    const max = Math.min(GAME.OBSTACLE_MAX_PER_CHUNK, blockCandidates.length);
    const count = Math.random() < 0.6 ? 1 : max;

    // sample without replacement
    const out: number[] = [];
    const pool = [...blockCandidates];
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      out.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return out;
  }

  private maybeShiftSafeLane() {
    if (Math.random() > GAME.SAFE_LANE_SHIFT_CHANCE) return;

    const step = (Math.random() < 0.5 ? -1 : 1) * GAME.SAFE_LANE_SHIFT_MAX_STEP;
    this.safeLane = clamp(this.safeLane + step, 0, 2);
  }

  private maybeSpawnCoins(chunk: Chunk) {
    if (Math.random() > GAME.COIN_SPAWN_CHANCE) return;

    //Prefer safe lane for fairness
    const lane = this.safeLane;

    // spawn a line (3 coins) or just 1 coin
    const line = Math.random() < GAME.COIN_LINE_CHANCE;
    const count = line ? 3 : 1;

    chunk.spawnCoins(this.scene, lane, count);
  }
}