import * as THREE from "three";
import { GAME } from "../constants";
import type { Coin } from "../entities/Coin";

export type PickupState = {
    coins: number;
    multiplier: number;
};

export class Pickups {
    private playerPos = new THREE.Vector3();

    private coins = 0;
    private multiplier = 1; 

    private comboTimer = 0; //time since last pickup

    //tweak pickup radius to feel good with the box player
    private pickupRadius = 0.9;

    reset() {
        this.coins = 0;
        this.multiplier = 1;
        this.comboTimer = 0;
    }

    getState(): PickupState {
        return { coins: this.coins, multiplier: this.multiplier };
    }

    update(dt: number) {
        //combo decay
        this.comboTimer += dt;
        if (this.comboTimer > GAME.COMBO_WINDOW_SEC) {
            this.multiplier = 1;
        }
    }

    collectFrom(player: THREE.Object3D, coins: Coin[], onCollect?: () => void) {
        this.playerPos.setFromMatrixPosition(player.matrixWorld);

        for (const coin of coins) {
            if (coin.collected) continue;

            const dx = coin.mesh.position.x - this.playerPos.x;
            const dy = coin.mesh.position.y - this.playerPos.y;
            const dz = coin.mesh.position.z - this.playerPos.z;
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq <= this.pickupRadius * this.pickupRadius) {
                coin.collected = true;
                coin.mesh.visible = false; // cheap "poof"

                this.coins += 1;

                //combo logic: collecting within window increases multiplier (up to cap)
                this.comboTimer = 0;
                this.multiplier = Math.min(GAME.MULTIPLIER_MAX, this.multiplier + 1);

                onCollect?.();
            }
        }
    }

    scoreGain(base: number) {
        return base * this.multiplier;
    }
}