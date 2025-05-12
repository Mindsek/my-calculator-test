import { Calculator } from '@/features/calculator/components/calculator';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      <Calculator />
    </main>
  );
}
