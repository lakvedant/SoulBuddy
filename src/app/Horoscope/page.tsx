import HoroscopeForm from '@/components/HoroscopeForm';

export default function KundaliPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daily Horoscope</h1>
      <HoroscopeForm />
    </main>
  );
}