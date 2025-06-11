// app/dashboard/page.jsx (or wherever your dashboard component lives)

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  LayoutGrid,
  ShieldAlert,
  Lock,
  FileText, // For Fake Data Presets (example)
  ArrowRight,
  TrendingUp, // Example for Tips
} from "lucide-react";
import Link from 'next/link';
import { useUser } from "@clerk/nextjs";

import GaugeComponent from 'react-gauge-component'; // <--- Import GaugeComponent
import { Skeleton } from "@/components/ui/skeleton";
export default function Dashboard() {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, isLoaded: isUserLoaded } = useUser();
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/dashboard/summary")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setSummaryData(data))
      .catch(err => {
        console.error("Failed to fetch dashboard summary:", err);
        setError(err.message || "Failed to load dashboard data.");
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Risk Styling Helpers ---
  const getRiskColorClass = (level, type = 'text') => { // type can be 'text', 'border', 'bg'
    const levelLower = level?.toLowerCase();
    switch (type) {
      case 'border':
        if (levelLower === 'critical') return 'border-red-700 dark:border-red-500';
        if (levelLower === 'high') return 'border-red-600 dark:border-red-400';
        if (levelLower === 'medium') return 'border-yellow-500 dark:border-yellow-400'; // Adjusted yellow
        if (levelLower === 'low') return 'border-green-600 dark:border-green-400';
        return 'border-gray-500 dark:border-gray-600';
      case 'bg':
        if (levelLower === 'critical') return 'bg-red-100 dark:bg-red-900/30';
        if (levelLower === 'high') return 'bg-red-100 dark:bg-red-900/30';
        if (levelLower === 'medium') return 'bg-yellow-100 dark:bg-yellow-800/30'; // Adjusted yellow
        if (levelLower === 'low') return 'bg-green-100 dark:bg-green-900/30';
        return 'bg-gray-100 dark:bg-gray-800';
      case 'progress': // For ShadCN Progress component
        if (levelLower === 'critical') return 'bg-red-700 dark:bg-red-500';
        if (levelLower === 'high') return 'bg-red-600 dark:bg-red-400';
        if (levelLower === 'medium') return 'bg-yellow-500 dark:bg-yellow-400'; // Adjusted yellow
        if (levelLower === 'low') return 'bg-green-600 dark:bg-green-400';
        return 'bg-gray-500 dark:bg-gray-600';
      default: // text
        if (levelLower === 'critical') return 'text-red-700 dark:text-red-500';
        if (levelLower === 'high') return 'text-red-600 dark:text-red-400';
        if (levelLower === 'medium') return 'text-yellow-600 dark:text-yellow-500'; // Adjusted yellow
        if (levelLower === 'low') return 'text-green-600 dark:text-green-400';
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  // Define gauge colors based on risk levels (adjust hex codes as needed)
  // These might be slightly different from text/border colors for better gauge appearance
  const gaugeColors = {
    low: "#22c55e",    // green-500
    medium: "#eab308", // yellow-500
    high: "#f97316",   // orange-500
    critical: "#dc2626" // red-600
  };
  
  
  const isLoadingOverall = loading || !isUserLoaded;

  const username = user?.firstName || user?.username || "User";


  // Default values if summaryData is null
  const trackedAppsCount = summaryData?.trackedAppsCount ?? 0;
  const vaultItemsCount = summaryData?.vaultItemsCount ?? 0;
  const userBreachesCount = summaryData?.userBreachesCount ?? 0;
  const overallRisk = summaryData?.overallRisk ?? { score: 0, level: 'Low' };
  const maxRiskScore = 30;
  // GaugeComponent uses value 0-100 usually, but we can scale it via maxValue prop
  const riskValueForGauge = isLoadingOverall ? 0 : overallRisk.score;
  // Actionable Insights logic remains the same
  // --- Actionable Insights Logic ---
  const getActionableInsights = () => {
    if (isLoadingOverall || !summaryData) return []; // No insights while loading

    const insights = [];
    if (overallRisk.level === 'Critical' || overallRisk.level === 'High') {
        insights.push({
            text: `Your risk score is ${overallRisk.level}. Prioritize reviewing apps contributing most to your score.`,
            link: '/apps',
            linkText: 'Review Apps',
            icon: ShieldAlert
        });
    }
    if (userBreachesCount > 0) {
        insights.push({
            text: `You're affected by ${userBreachesCount} known data breach${userBreachesCount > 1 ? 'es' : ''}. Check details and secure affected accounts.`,
            link: '/breaches',
            linkText: 'Check Breaches',
            icon: ShieldAlert
        });
    }
    if (vaultItemsCount === 0) {
        insights.push({
            text: "You haven't stored any credentials in the vault yet. Secure your passwords!",
            link: '/data-vault',
            linkText: 'Add to Vault',
            icon: Lock
        });
    } else if (vaultItemsCount < 5) { // Example threshold
         insights.push({
            text: `Keep adding credentials to your vault for better security. You currently have ${vaultItemsCount}.`,
            link: '/data-vault',
            linkText: 'Open Vault',
            icon: Lock
        });
    }
     if (trackedAppsCount < 3) { // Example threshold
         insights.push({
            text: `Start tracking the apps you use to understand your data footprint better.`,
            link: '/apps',
            linkText: 'Track Apps',
            icon: LayoutGrid
        });
    }

    // Add a generic tip if no specific actions
    if (insights.length === 0) {
        insights.push({
            text: "Stay vigilant! Regularly review your privacy settings and tracked data.",
            link: '#', // Or link to a general help page
            linkText: 'Learn More',
            icon: TrendingUp
        })
    }

    return insights.slice(0, 2); // Show top 1 or 2 insights initially
  };

  const actionableInsights = getActionableInsights();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
            <div className="w-36 h-36 sm:w-48 sm:h-48 flex-shrink-0">
            <DotLottieReact
            src="/lock.lottie" // Find a relevant Lottie animation
            loop
            autoplay
            style={{ width: '100%', height: '100%'}}
            />
            </div>
    </div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-red-500">Error loading dashboard: {error}</p></div>;
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 lg:grid-rows-fr gap-6 p-6"> {/* Adjusted grid */}

      {/* --- Welcome Banner (Spans more columns) --- */}
      <Card className="lg:col-span-2 xl:col-span-3 rounded-xl shadow-sm overflow-hidden align-centre bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 py-0">
        <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center ">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-semibold mb-1">
              Welcome back, {username}! 👋
            </h2>
            <p className="text-muted-foreground mb-4">Your personalized privacy dashboard.</p>
             {/* Maybe link to a report page later */}
            {/* <Link href="/privacy-report">
               <Button variant="secondary">View Privacy Report</Button>
            </Link> */}
          </div>
          <div className="w-36 h-36 sm:w-48 sm:h-48 flex-shrink-0">
            <DotLottieReact
              src="/drone-o.lottie" // Find a relevant Lottie animation
              loop
              autoplay
              style={{ width: '100%', height: '100%'}}
            />
          </div>
        </CardContent>
      </Card>

      {/* --- Overall Risk Card with New Gauge --- */}
      <Card className={`lg:row-span-2 xl:row-span-2 rounded-xl shadow-sm flex flex-col ${getRiskColorClass(overallRisk.level, 'bg')} border ${getRiskColorClass(overallRisk.level, 'border')}`}>
         <CardHeader className="pb-0 pt-4">
           <CardTitle className="text-base font-semibold text-center text-gray-700 dark:text-gray-300">Overall Data Risk</CardTitle>
         </CardHeader>
        <CardContent className="p-4 pt-0 flex flex-col items-center justify-center flex-grow">
          {isLoadingOverall ? (
             <div className="flex flex-col items-center justify-center h-[180px]">
                <Skeleton className="h-24 w-40 mb-2" />
                <Skeleton className="h-6 w-20" />
             </div>
          ) : (
            <>
              {/* Gauge Component */}
              <div className="w-[200px] h-auto -mb-4"> {/* Adjusted margin */}
                  <GaugeComponent
                      value={riskValueForGauge} // Current score
                      maxValue={maxRiskScore} // Max score defined earlier
                      type="semicircle"
                      arc={{
                          // Adjust gradient based on level for better visuals
                          // gradient: true, // Option for gradient fill
                          colorArray: [gaugeColors.low, gaugeColors.medium, gaugeColors.high, gaugeColors.critical], // Colors for segments
                          // Define segments based on your score thresholds
                          subArcs: [
                              { limit: 5, color: gaugeColors.low },    // Low range
                              { limit: 10, color: gaugeColors.medium }, // Medium range
                              { limit: 20, color: gaugeColors.high },   // High range
                              { color: gaugeColors.critical }           // Critical range (rest)
                          ],
                          padding: 0.02,
                          width: 0.25 // Adjust arc width
                      }}
                      pointer={{
                          type: "arrow", // Or "blob"
                          color: "#6b7280", // gray-500
                          length: 0.7,
                          width: 10,
                      }}
                      labels={{
                          valueLabel: { formatTextValue: value => '', // Hide default value label
                           style: {fontSize: '0px'} }, // Further hide if needed
                          tickLabels: {
                            type: "inner",
                            ticks: [ // Example ticks, adjust as needed
                               { value: 0 }, { value: maxRiskScore/2 }, { value: maxRiskScore }
                             ],
                             defaultTickValueConfig: {
                                 formatTextValue: value => value, // Show tick values
                                 style: {fontSize: '10px', fill: 'currentColor'} // Style ticks
                             },
                              defaultTickLineConfig: { // Hide tick lines if desired
                                  style: {strokeWidth: 0}
                              }
                          }
                      }}
                  />
              </div>
               {/* Risk Score Text (Centered below gauge) */}
               <div className={`text-4xl font-bold mt-0 ${getRiskColorClass(overallRisk.level, 'text')}`}>
                   {overallRisk.score}
               </div>
               {/* Risk Level Text */}
               <p className={`font-semibold text-lg mb-3 ${getRiskColorClass(overallRisk.level, 'text')}`}>
                   {overallRisk.level} Risk
               </p>
            </>
           )}
           {/* Actionable Insights Section */}
           <div className="mt-auto w-full space-y-2 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 text-center">Recommended Actions:</h4>
               {isLoadingOverall ? (<> <Skeleton className="h-5 w-full" /> <Skeleton className="h-5 w-3/4"/> </> ):(
                   actionableInsights.length > 0 ? ( 
                    actionableInsights.map((insight, index) => (
                      <Link href={insight.link} key={index} className="block text-sm">
                        <Button variant="link" size="sm" className={`p-0 h-auto ${getRiskColorClass(overallRisk.level, 'text')}`}>
                          <insight.icon className="mr-1.5 h-4 w-4 flex-shrink-0" /> {insight.linkText} <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    ))
                   ) : ( <p className="text-sm text-muted-foreground text-center">Looking good!</p> )
               )}
           </div>
        </CardContent>
      </Card>


      {/* --- Metric Cards (Improved Layout) --- */}
      <Card className="rounded-xl shadow-md dark:bg-gray-800/30 border dark:border-gray-800">
         <CardHeader>
           <CardTitle className="text-sm font-medium text-muted-foreground">Tracked Apps</CardTitle>
         </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center justify-between gap-4">
             <LayoutGrid className="h-10 w-10 text-blue-500 flex-shrink-0" />
             <div className="text-right">
                <h3 className="text-4xl font-bold mb-1">{trackedAppsCount}</h3>
                <Link href="/apps">
                   <Button variant="link" size="sm">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
                </Link>
             </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-md dark:bg-gray-800/30 border dark:border-gray-800">
         <CardHeader>
           <CardTitle className="text-sm font-medium text-muted-foreground">Affected by Breaches</CardTitle>
         </CardHeader>
        <CardContent className="p-6 pt-0">
           <div className="flex items-center justify-between gap-4">
             <ShieldAlert className={`h-10 w-10 flex-shrink-0 ${userBreachesCount > 0 ? 'text-rose-600' : 'text-gray-400'}`} />
             <div className="text-right">
                <h3 className={`text-4xl font-bold mb-1 ${userBreachesCount > 0 ? 'text-rose-600' : ''}`}>{userBreachesCount}</h3>
                 <Link href="/breaches">
                   <Button variant="link" size="sm">Check Now <ArrowRight className="ml-1 h-4 w-4" /></Button>
                </Link>
             </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-md dark:bg-gray-800/30 border dark:border-gray-800">
         <CardHeader>
           <CardTitle className="text-sm font-medium text-muted-foreground">Vault Items</CardTitle>
         </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex items-center justify-between gap-4">
            <Lock className="h-10 w-10 text-purple-600 flex-shrink-0" />
             <div className="text-right">
                <h3 className="text-4xl font-bold mb-1">{vaultItemsCount}</h3>
                 <Link href="/data-vault">
                   <Button variant="link" size="sm">Open Vault <ArrowRight className="ml-1 h-4 w-4" /></Button>
                 </Link>
             </div>
           </div>
        </CardContent>
      </Card>

      {/* Placeholder for Fake Data Presets count */}
      {/* <Card className="rounded-xl shadow-sm"> ... </Card> */}


      {/* --- Privacy Tips (Spans columns on some layouts) --- */}
       <Card className="lg:col-span-2 xl:col-span-4 rounded-xl shadow-sm"> {/* Adjust span as needed */}
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Privacy Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Make these dynamic later */}
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
             <LayoutGrid className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0"/>
             <p className="text-sm text-muted-foreground">Regularly review permissions and data shared with your <Link href="/apps" className="font-medium text-primary hover:underline">Tracked Apps</Link>.</p>
          </div>
           <div className="flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-900/30 rounded-lg">
             <ShieldAlert className="h-5 w-5 text-rose-500 mt-1 flex-shrink-0"/>
             <p className="text-sm text-muted-foreground">Check for new <Link href="/breaches" className="font-medium text-primary hover:underline">Data Breaches</Link> that might affect your linked accounts.</p>
          </div>
           <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
             <Lock className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0"/>
             <p className="text-sm text-muted-foreground">Use strong, unique passwords for each service and store them securely in your <Link href="/data-vault" className="font-medium text-primary hover:underline">Data Vault</Link>.</p>
          </div>
           <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
             <FileText className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"/> {/* Example icon */}
             <p className="text-sm text-muted-foreground">Utilize the <Link href="/fake-data" className="font-medium text-primary hover:underline">Fake Data Generator</Link> when signing up for non-essential services.</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}