// components/breach-checker/PublicEmailChecker.jsx

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import toast from 'react-hot-toast';
import { Loader2, Shield, ShieldAlert, ShieldCheck, Search } from "lucide-react";
import axios from 'axios';
import ErrorMessageWithExternalLink from './ErrorMessageWithExternalLink'; // <-- Import the new component

// Helper component to display individual breach details (remains the same)
const BreachDetailItem = ({ breach }) => (
    // ... (no changes here) ...
    <AccordionItem value={breach.name || breach.breachID || Math.random().toString()} key={breach.name || breach.breachID || Math.random().toString()}>
        <AccordionTrigger className="text-sm hover:no-underline">
            {breach.name} ({breach.date || 'N/A'})
        </AccordionTrigger>
        <AccordionContent>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{breach.description || "No description available."}</p>
            <strong>Compromised Data:</strong>
            <ul className="list-disc list-inside text-xs">
                {breach.compromisedData && breach.compromisedData.length > 0 ?
                    breach.compromisedData.map((data, i) => <li key={i}>{data}</li>) :
                    <li>Data types not specified.</li>
                }
            </ul>
        </AccordionContent>
    </AccordionItem>
);


const PublicEmailChecker = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [breachData, setBreachData] = useState(null);
    const [error, setError] = useState(""); // Keep this for internal logic if needed, or rely on toast
    const [apiError, setApiError] = useState(null); // Specific state for API errors to pass to the new component

    const handleCheck = async () => {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setHasSearched(true);
        setLoading(true);
        setBreachData(null);
        setError("");
        setApiError(null); // Reset API error

        try {
            const response = await axios.get(`https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(email)}`, {
                headers: { 'Accept': 'application/json' },
                validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
            });

            if (response.status === 404 || response.data.Error === "Not found") {
                setBreachData([]);
                toast.success("No breaches found for this email.");
            } else if (response.data.Error) {
                throw new Error(response.data.Error); // Let the catch block handle API-specific errors
            } else if (response.data.ExposedBreaches?.breaches_details?.length > 0) {
                // ... (formatting logic remains the same) ...
                const formattedBreaches = response.data.ExposedBreaches.breaches_details.map((detail) => ({
                    name: detail.breach,
                    date: detail.xposed_date
                        ? new Date(parseInt(detail.xposed_date, 10), 0, 1).toISOString().split('T')[0]
                        : 'N/A',
                    description: detail.details || "No description available.",
                    compromisedData: detail.xposed_data?.split(';') || [],
                }));
                setBreachData(formattedBreaches);
                toast.error(`Warning: ${formattedBreaches.length} potential breach(es) found!`, { icon: <ShieldAlert /> });
            } else {
                setBreachData([]);
                toast.success("No breaches found for this email.");
            }
        } catch (err) {
            const message = err.response?.data?.Error || err.response?.data?.message || err.message || "Failed to check breaches. Please try again.";
            setApiError(message); // Set the specific API error message
            console.error("Public Breach check error:", err.response?.data || err);
            // Toast can still show a generic error or the specific one
            // toast.error(`Error: ${message}`);
            setBreachData(null);
        } finally {
            setLoading(false);
        }
    };
    const [hasSearched, setHasSearched] = useState(false);


    return (
        <Card className="w-full max-w-xl mx-auto">
            <CardHeader>
                {/* ... CardTitle, CardDescription ... */}
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-full">
                        <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-semibold">Public Email Breach Scan</CardTitle>
                        <CardDescription className="mt-1 text-xs">
                            Check any email against the XposedOrNot database. Results are not stored by Privmat.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-4 pb-6">
                <div className="flex space-x-2">
                    {/* ... Input and Button ... */}
                     <Input
                        type="email"
                        placeholder="Enter any email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        aria-label="Email address to check for breaches"
                    />
                    <Button onClick={handleCheck} disabled={loading || !email}>
                        {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Search className="mr-2 h-4 w-4" />}
                        {loading ? "Checking..." : "Scan"}
                    </Button>
                </div>

                {/* Use the new error component */}
                {apiError && (
                    <ErrorMessageWithExternalLink
                        message={apiError}
                        externalUrl="https://xposedornot.com"
                        externalUrlText="XposedOrNot website"
                    />
                )}

                {hasSearched && !loading && !apiError && breachData !== null && (
                    <div className="mt-6">
                        {/* ... Display results (no changes here from your version) ... */}
                        {breachData.length === 0 ? (
                            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-600/30 dark:border-green-500/30 rounded-md text-green-700 dark:text-green-300">
                                <ShieldCheck className='mr-2 h-5 w-5 flex-shrink-0' />
                                <span>No breaches found</span>
                            </div>
                        ) : (
                            <div>
                                <h3 className="font-semibold text-orange-500 dark:text-orange-400 mb-3 flex items-center text-md">
                                    <ShieldAlert className='mr-2 h-5 w-5 flex-shrink-0' />
                                    Warning: {breachData.length} Potential Exposure(s) Found
                                </h3>
                                <Accordion type="single" collapsible className="w-full">
                                    {breachData.map((breach, index) => (
                                        <BreachDetailItem breach={breach} key={index} />
                                    ))}
                                </Accordion>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PublicEmailChecker;