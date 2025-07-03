export type Coordinate = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type FoodType = 'BTC' | 'ETH' | 'SONIC' | '1INCH' | 'AARNA';

export type Food = {
  x: number;
  y: number;
  type: FoodType;
  score: number;
};
