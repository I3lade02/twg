export type RunnerGameOptions = {
    host: HTMLElement;
    onScoreChange?: (score: number) => void;
    onGameOver?: () => void;
};