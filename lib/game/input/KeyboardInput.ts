export type InputSnapshot = {
    leftPressed: boolean;
    rightPressed: boolean;
    jumpPressed: boolean;
    restartPressed: boolean;
};

export class KeyboardInput{
    private down = new Set<string>();

    //"edge" presses (true only on the frame the key went down)
    private jumpEdge = false;
    private restartEdge = false;
    private leftEdge = false;
    private rightEdge = false;

    constructor() {
        window.addEventListener("keydown", this.onKeyDown, { passive: true });
        window.addEventListener("keyup", this.onKeyUp, { passive: true });
    }

    dispose() {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
    }

    snapshot(): InputSnapshot {
        const snap: InputSnapshot = {
            leftPressed: this.leftEdge,
            rightPressed: this.rightEdge,
            jumpPressed: this.jumpEdge,
            restartPressed: this.restartEdge,
        };

        //consume edges after read
        this.leftEdge = false;
        this.rightEdge = false;
        this.jumpEdge = false;
        this.restartEdge = false;

        return snap;
    }

    private onKeyDown = (e: KeyboardEvent) => {
        if (this.down.has(e.code)) return; //prevent repeats for edges
        this.down.add(e.code);

        if (e.code === "ArrowLeft" || e.code === "KeyA") this.leftEdge = true;
        if (e.code === "ArrowRight" || e.code === "KeyD") this.rightEdge = true;
        if (e.code === "Space" || e.code === "ArrowUp") this.jumpEdge = true;
        if (e.code === "KeyR") this.restartEdge = true;
    };

    private onKeyUp = (e: KeyboardEvent) => {
        this.down.delete(e.code);
    };
}