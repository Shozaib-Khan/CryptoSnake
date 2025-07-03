'use client';

import { useReducer, useEffect, useCallback, Reducer, useRef } from 'react';
import { Direction, Coordinate, Food } from './types';
import {
  BOARD_SIZE,
  SNAKE_SIZE,
  FOOD_SIZE,
  INITIAL_SNAKE_POSITION,
  INITIAL_SPEED_PPT,
  GAME_TICK_MS,
  SPEED_INCREMENT,
  BOARD_SHRINK_AMOUNT,
  FOOD_TYPES,
} from './constants';

export interface GameState {
  snake: Coordinate[];
  food: Food;
  direction: Direction | null;
  speed: number;
  score: number;
  isGameOver: boolean;
  isGameStarted: boolean;
  isInitialized: boolean;
  currentBoardSize: number;
  segmentsToAdd: number;
}

type Action =
  | { type: 'INITIALIZE_GAME' }
  | { type: 'START_GAME' }
  | { type: 'RESTART_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'CHANGE_DIRECTION'; payload: Direction }
  | { type: 'TICK' };

function getRandomCoordinate(boardSize: number, exclude: Coordinate[]): Coordinate {
  let coordinate: Coordinate;
  do {
    coordinate = {
      x: Math.floor(Math.random() * (boardSize - FOOD_SIZE)) + FOOD_SIZE / 2,
      y: Math.floor(Math.random() * (boardSize - FOOD_SIZE)) + FOOD_SIZE / 2,
    };
  } while (exclude.some(ex => Math.hypot(ex.x - coordinate.x, ex.y - coordinate.y) < SNAKE_SIZE * 2));
  return coordinate;
}

function createNewFood(snake: Coordinate[], boardSize: number): Food {
  const rand = Math.random();
  let cumulativeProbability = 0;
  const selectedFoodConfig =
    FOOD_TYPES.find(food => {
      cumulativeProbability += food.probability;
      return rand <= cumulativeProbability;
    }) || FOOD_TYPES[0];

  const coord = getRandomCoordinate(boardSize, snake);
  return {
    ...coord,
    type: selectedFoodConfig.type,
    score: selectedFoodConfig.score,
  };
}

const getInitialState = (): GameState => ({
  snake: INITIAL_SNAKE_POSITION,
  food: { x: -1, y: -1, type: 'BTC', score: 1 },
  direction: null,
  speed: INITIAL_SPEED_PPT,
  score: 0,
  isGameOver: false,
  isGameStarted: false,
  isInitialized: false,
  currentBoardSize: BOARD_SIZE,
  segmentsToAdd: 0,
});

const gameReducer: Reducer<GameState, Action> = (state, action): GameState => {
  switch (action.type) {
    case 'INITIALIZE_GAME':
      return {
        ...state,
        food: createNewFood(state.snake, state.currentBoardSize),
        isInitialized: true,
      };
    case 'START_GAME':
      return { ...state, isGameStarted: true, direction: 'RIGHT' };
    case 'RESTART_GAME': {
      const initialState = getInitialState();
      return {
        ...initialState,
        food: createNewFood(initialState.snake, initialState.currentBoardSize),
        isInitialized: true,
        isGameStarted: true,
        direction: 'RIGHT',
      };
    }
    case 'GAME_OVER':
      return { ...state, isGameOver: true };
    case 'CHANGE_DIRECTION': {
      const { direction: currentDirection } = state;
      const newDirection = action.payload;
      if (!currentDirection) return { ...state, direction: newDirection };
      if (currentDirection === 'UP' && newDirection === 'DOWN') return state;
      if (currentDirection === 'DOWN' && newDirection === 'UP') return state;
      if (currentDirection === 'LEFT' && newDirection === 'RIGHT') return state;
      if (currentDirection === 'RIGHT' && newDirection === 'LEFT') return state;
      return { ...state, direction: newDirection };
    }
    case 'TICK': {
      if (state.isGameOver || !state.isGameStarted || !state.direction) return state;

      const newSnake = [...state.snake];
      const head = { ...newSnake[0] };

      switch (state.direction) {
        case 'UP': head.y -= state.speed; break;
        case 'DOWN': head.y += state.speed; break;
        case 'LEFT': head.x -= state.speed; break;
        case 'RIGHT': head.x += state.speed; break;
      }

      newSnake.unshift(head);

      // Wall collision
      if (head.x < SNAKE_SIZE/2 || head.x >= state.currentBoardSize - SNAKE_SIZE/2 || head.y < SNAKE_SIZE/2 || head.y >= state.currentBoardSize - SNAKE_SIZE/2) {
        return { ...state, isGameOver: true };
      }

      // Self collision
      for (let i = SNAKE_SIZE; i < newSnake.length; i++) {
        if (Math.hypot(head.x - newSnake[i].x, head.y - newSnake[i].y) < SNAKE_SIZE / 2) {
           return { ...state, isGameOver: true };
        }
      }

      let newState: GameState = { ...state, snake: newSnake };

      // Food collision
      const distanceToFood = Math.hypot(head.x - newState.food.x, head.y - newState.food.y);
      if (distanceToFood < (SNAKE_SIZE + FOOD_SIZE) / 2) {
        const newScore = Math.min(100, newState.score + newState.food.score);

        if (newScore >= 100) {
          return { ...newState, snake: newSnake, score: 100, isGameOver: true };
        }
        
        const newSpeed = newState.speed + SPEED_INCREMENT;
        const newBoardSize = Math.max(newState.currentBoardSize - BOARD_SHRINK_AMOUNT * newState.food.score, SNAKE_SIZE * 10);
        
        newState = {
          ...newState,
          food: createNewFood(newSnake, newBoardSize),
          score: newScore,
          speed: newSpeed,
          currentBoardSize: newBoardSize,
          segmentsToAdd: newState.segmentsToAdd + 5,
        };
      }
      
      if (newState.segmentsToAdd > 0) {
        newState.segmentsToAdd -= 1;
      } else {
        newState.snake.pop();
      }

      return newState;
    }
    default:
      return state;
  }
};

export const useGameLogic = () => {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());
  const gameIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!state.isInitialized) {
      dispatch({ type: 'INITIALIZE_GAME' });
    }
  }, [state.isInitialized]);

  const startGame = () => dispatch({ type: 'START_GAME' });
  
  const restartGame = useCallback(() => {
    dispatch({ type: 'RESTART_GAME' });
  }, []);
  
  const changeDirection = useCallback((direction: Direction) => {
    dispatch({ type: 'CHANGE_DIRECTION', payload: direction });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.isGameStarted) {
        if(e.key === 'ArrowUp' || e.key === 'w' || e.key === 'ArrowDown' || e.key === 's' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') {
          startGame();
        }
      }

      let newDirection: Direction | null = null;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          newDirection = 'UP';
          break;
        case 'ArrowDown':
        case 's':
          newDirection = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
          newDirection = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
          newDirection = 'RIGHT';
          break;
        default: return;
      }
      e.preventDefault();
      if(newDirection) {
        changeDirection(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, state.isGameStarted]);

  useEffect(() => {
    if (!state.isGameStarted || state.isGameOver) {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
      return;
    }
    
    gameIntervalRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, GAME_TICK_MS);

    return () => clearInterval(gameIntervalRef.current);
  }, [state.isGameStarted, state.isGameOver]);

  return { state, startGame, changeDirection, restartGame };
};
