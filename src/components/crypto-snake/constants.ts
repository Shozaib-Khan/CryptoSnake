import type { FoodType } from './types';

export const BOARD_SIZE = 500;
export const SNAKE_SIZE = 15;
export const FOOD_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 10;
export const INITIAL_SNAKE_POSITION = Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({ x: 100 - i * (SNAKE_SIZE / 2), y: 100 }));
export const GAME_TICK_MS = 16; // approx 60fps
export const INITIAL_SPEED_PPT = 2; // Pixels per tick
export const SPEED_INCREMENT = 0.05;

export const BOARD_SHRINK_AMOUNT = 2; // Pixels to shrink board by on each score

export const FOOD_TYPES: { type: FoodType; score: number; probability: number }[] = [
  { type: 'BTC', score: 1, probability: 0.25 },
  { type: 'ETH', score: 1, probability: 0.25 },
  { type: 'SONIC', score: 1, probability: 0.2 },
  { type: '1INCH', score: 1, probability: 0.2 },
  { type: 'AARNA', score: 10, probability: 0.1 },
];
