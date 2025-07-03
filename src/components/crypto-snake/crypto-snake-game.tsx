'use client';

import * as React from 'react';
import { useGameLogic } from './use-game-logic';
import { SNAKE_SIZE, FOOD_SIZE } from './constants';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { FoodDisplay } from './food-icons';
import type { Direction } from './types';

const getRotationStyle = (direction: Direction | null): string => {
  switch (direction) {
    case 'UP':
      return 'rotate(0deg)';
    case 'DOWN':
      return 'rotate(180deg)';
    case 'LEFT':
      return 'rotate(-90deg)';
    case 'RIGHT':
      return 'rotate(90deg)';
    default:
      return 'rotate(90deg)'; // Default to right, initial direction
  }
};

export function CryptoSnakeGame() {
  const { state, startGame, changeDirection, restartGame } = useGameLogic();
  const { snake, food, score, isGameOver, isGameStarted, isInitialized, currentBoardSize, direction } = state;

  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isGameOver || !isGameStarted) return;
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const diffX = touchStartRef.current.x - touchEnd.x;
    const diffY = touchStartRef.current.y - touchEnd.y;
    const swipeThreshold = 50;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > swipeThreshold) changeDirection('LEFT');
      else if (diffX < -swipeThreshold) changeDirection('RIGHT');
    } else {
      if (diffY > swipeThreshold) changeDirection('UP');
      else if (diffY < -swipeThreshold) changeDirection('DOWN');
    }
    touchStartRef.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full flex justify-between items-center px-4 py-2 rounded-lg bg-background/50 border">
          <p className="text-lg uppercase">Score: <span className="font-bold text-primary">{score}</span></p>
          <p className="text-lg uppercase">Length: <span className="font-bold text-primary">{snake.length}</span></p>
      </div>

      <div
        className={cn(
          'relative bg-background border-2 border-primary/50 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out'
        )}
        style={{
          width: currentBoardSize,
          height: currentBoardSize,
          transform: 'translateZ(0)',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
      >
        {!isGameStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20">
            <Button onClick={startGame} size="lg" className="font-bold text-xl uppercase">
              Start Game
            </Button>
          </div>
        )}
        
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const rotation = isHead ? getRotationStyle(direction) : '';

          return (
            <div
              key={index}
              className="absolute"
              style={{
                width: SNAKE_SIZE,
                height: SNAKE_SIZE,
                transform: `translate(${segment.x}px, ${segment.y}px) ${rotation}`,
                marginLeft: -SNAKE_SIZE / 2,
                marginTop: -SNAKE_SIZE / 2,
                zIndex: snake.length - index,
              }}
            >
              {isHead ? (
                <div className="relative w-full h-full bg-green-500 rounded-md border-2 border-green-700">
                  {/* Eyes */}
                  <div className="absolute top-[25%] left-[20%] w-1 h-1 bg-white rounded-full" />
                  <div className="absolute top-[25%] right-[20%] w-1 h-1 bg-white rounded-full" />
                </div>
              ) : (
                <div
                  className="w-full h-full bg-green-600 rounded-md border border-green-800"
                />
              )}
            </div>
          );
        })}

        {isInitialized && food && (
          <div
            className="absolute"
            style={{
              width: FOOD_SIZE,
              height: FOOD_SIZE,
              transform: `translate(${food.x}px, ${food.y}px)`,
              marginLeft: -FOOD_SIZE / 2,
              marginTop: -FOOD_SIZE / 2,
            }}
          >
            <FoodDisplay type={food.type} />
          </div>
        )}
      </div>
      
      <AlertDialog open={isGameOver}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary text-3xl uppercase">
              {score >= 100 ? "You Win!" : "Game Over"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xl uppercase">
              Your final score is <span className="font-bold text-primary">{score}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={restartGame} className="w-full font-bold text-xl uppercase">Play Again</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
