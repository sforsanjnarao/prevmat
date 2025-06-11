// app/breaches/page.jsx (Example Structure)

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import toast from 'react-hot-toast';
import { RefreshCw } from 'lucide-react'; // Icon for refresh button

const MyBreaches = () => {
    const [breachHistory, setBreachHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isChecking, setIsChecking] = useState(false); // State for the check button
    const [error, setError] = useState(null);

    // Fetch stored breach history on load
    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        setError(null);
        try {
            const response = await fetch('/api/breaches/user-history'); // Fetch stored history
            if (!response.ok) {
                const errData = await response.json().catch(()=>({}));
                throw new Error(errData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setBreachHistory(data.breaches || []);
        } catch (err) {
            console.error("Failed to fetch breach history:", err);
            setError(err.message);
            toast.error("Failed to load your breach history.");
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []); // Fetch on initial mount

    // Function to trigger the backend check for the logged-in user's email
    const handleCheckMyEmail = async () => {
        setIsChecking(true);
        setError(null); // Clear previous errors specific to check
        try {
            const response = await fetch('/api/breaches/check-my-email', {
                method: 'POST',
                // No body needed as API gets email from authenticated user
            });

             const data = await response.json(); // Always try to parse JSON

            if (!response.ok) {
                 throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            toast.success(data.message || "Breach check complete.");
            // Re-fetch the history to show any newly added breaches
            fetchHistory();

        } catch (err) {
            console.error("Error checking email:", err);
            toast.error(`Check failed: ${err.message}`);
            setError(`Check failed: ${err.message}`); // Optionally show error inline too
        } finally {
            setIsChecking(false);
        }
    };

    return (
            <Card className={"w-full max-w-lg mx-auto"}>
                <CardHeader>
                    <div className="flex flex-col  gap-4">
                        <div className='flex flex-col gap-2'>
                            <CardTitle>Your Data Breach History</CardTitle>
                            <CardDescription>Breaches associated with your registered email stored in Privmat.</CardDescription>
                        </div>
                        <Button className={"max-w-50 items-end"} onClick={handleCheckMyEmail} disabled={isChecking}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                            {isChecking ? "Checking..." : "Check My Email Now"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoadingHistory && <p>Loading history...</p>}
                    {error && !isLoadingHistory && <p className="text-red-500">Error: {error}</p>}
                    {!isLoadingHistory && !error && (
                        breachHistory.length === 0 ? (
                            <p className="text-gray-500">No breaches recorded for your email yet. Click "Check My Email Now".</p>
                        ) : (
                            <Accordion type="single" collapsible className="w-full">
                                {breachHistory.map((breach, index) => (
                                    <AccordionItem value={`breach-${breach.id}`} key={breach.id || index}>
                                        <AccordionTrigger className={"text-amber-500"}>{breach.name} ({breach.date})</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{breach.description || "No description available."}</p>
                                            <strong>Compromised Data:</strong>
                                            <ul className="list-disc list-inside text-sm">
                                            {breach.compromisedData.length > 0 ? breach.compromisedData.map((data, i) => <li key={i}>{data}</li>) : <li>Data types not specified.</li>}
                                            </ul>
                                            <p className="text-sm text-gray-500 mt-2">Checked on: {new Date(breach.addedToHistoryAt).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-500">Email Checked: {breach.emailChecked}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )
                    )}
                </CardContent>
            </Card>

    );
};

export default MyBreaches;