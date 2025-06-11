"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Braces } from 'lucide-react';

const FakeDataGenerator = () => {
  const [fakeData, setFakeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const generateFakeData = async () => {
    setIsLoading(true); // Set loading state to true

    try {
      const response = await fetch('/api/fake-data/generate');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFakeData(data);
    } catch (error) {
      console.error("Failed to fetch fake data:", error);
      // Handle error (e.g., display an error message to the user)
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto ">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2"><Braces />Fake Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col justify-center">
        <Button onClick={generateFakeData} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Data"}
        </Button>

        {fakeData && (
          <div className="mt-4">
            <p><strong>Name:</strong> {fakeData.name}</p>
            <p><strong>Email:</strong> {fakeData.email}</p>
            <p><strong>Phone:</strong> {fakeData.phone}</p>
            <p><strong>Address:</strong> {fakeData.address}</p>
            <p><strong>City:</strong> {fakeData.city}</p>
            <p><strong>Country:</strong> {fakeData.country}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FakeDataGenerator;