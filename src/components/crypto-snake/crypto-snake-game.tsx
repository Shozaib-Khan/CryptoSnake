'use client';

import * as React from 'react';
import { useGameLogic } from './use-game-logic';
import { BOARD_SIZE, SNAKE_SIZE, FOOD_SIZE } from './constants';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { FoodDisplay } from './food-icons';
import { MobileControls } from './mobile-controls';
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

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const width = entries[0].contentRect.width;
        setScale(width / BOARD_SIZE);
      }
    });

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full max-w-[500px] items-center justify-between rounded-lg border bg-background/50 px-4 py-2">
          <p className="text-lg uppercase">Score: <span className="font-bold text-primary">{score}</span></p>
          <p className="text-lg uppercase">Length: <span className="font-bold text-primary">{snake.length}</span></p>
      </div>

      <div
        ref={containerRef}
        className="w-full max-w-[500px]"
        style={{ height: BOARD_SIZE * scale }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: BOARD_SIZE,
            height: BOARD_SIZE,
          }}
        >
          <div
            className={cn(
              'relative bg-background border-2 border-primary/50 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out'
            )}
            style={{
              width: currentBoardSize,
              height: currentBoardSize,
              transform: 'translateZ(0)',
            }}
            tabIndex={0}
          >
            {!isGameStarted && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80">
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
                    <div className="relative h-full w-full rounded-md border-2 border-green-700 bg-green-500">
                      {/* Eyes */}
                      <div className="absolute left-[20%] top-[25%] h-1 w-1 rounded-full bg-white" />
                      <div className="absolute right-[20%] top-[25%] h-1 w-1 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div
                      className="h-full w-full rounded-md border border-green-800 bg-green-600"
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
        </div>
      </div>
      
      <MobileControls onDirectionChange={changeDirection} />

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