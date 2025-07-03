import { CryptoSnakeGame } from '@/components/crypto-snake/crypto-snake-game';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 font-body">
      <div className="text-center mb-8">
        <h1 className="text-6xl md:text-7xl font-bold font-headline text-primary">
          CRYPTOSNAKE
        </h1>
        <p className="text-muted-foreground mt-2 text-lg uppercase">The cryptocurrency arcade game</p>
      </div>
      <CryptoSnakeGame />
    </main>
  );
}
