import FakeDataGenerator  from "./_components/FakeDataGenerator";

export default function FakeDataPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-20 md:py-24 lg:py-32">
      <h1 className="text-3xl font-bold tracking-tighter text-center mb-12">
        Generate Fake Data
      </h1>
      <FakeDataGenerator />
    </div>
  );
}