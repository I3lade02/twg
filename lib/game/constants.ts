export const GAME = {
    LANES: [-2, 0, 2] as const,
    
    SPEED_START: 9,
    SPEED_RAMP: 0.15,

    CHUNK_LEN: 12,
    CHUNK_WIDTH: 8,
    CHUNKS_INITIAL: 10,

    //When a chunk passes this Z (toward camera), recycle it
    CHUNK_RECYCLE_Z: 18,

    SAFE_LANE_SHIFT_CHANCE: 0.35,
    SAFE_LANE_SHIFT_MAX_STEP: 1,
    PATTERN_CHANCE: 0.8,

    //Obstacles
    OBSTACLE_SIZE: 1.2,
    OBSTACLE_SPAWN_CHANCE: 0.7, //chance chunk has obstacles
    OBSTACLE_MAX_PER_CHUNK: 2,

    //Coins
    COIN_RADIUS: 0.35,
    COIN_Y: 1.05,
    COIN_SPAWN_CHANCE: 0.85,
    COIN_LINE_CHANCE: 0.45,
    COIN_LINE_GAP_Z: 2.2,

    //Combo / multiplier
    COMBO_WINDOW_SEC: 2,
    MULTIPLIER_MAX: 5,
};