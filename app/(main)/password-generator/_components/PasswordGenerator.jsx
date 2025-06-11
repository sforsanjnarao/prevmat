// components/password-generator/PasswordGenerator.jsx

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from "@/components/ui/slider";
import { Copy, RefreshCw, KeyRound, CheckCircle2, AlertCircle, Lock } from 'lucide-react'; // Added Lock icon
import toast from 'react-hot-toast';
import Link from 'next/link'; // Import Link for navigation

const PasswordGenerator = () => {
  // ... (existing state variables: password, passwordLength, includeUppercase, etc.) ...
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ text: 'Weak', color: 'text-red-500' });


  const characterSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>/?',
  };

  const calculateStrength = (pwd) => {
    // ... (calculateStrength function remains the same) ...
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score >= 7) return { text: 'Very Strong', color: 'text-green-600 dark:text-green-400' };
    if (score >= 5) return { text: 'Strong', color: 'text-green-500 dark:text-green-300' };
    if (score >= 3) return { text: 'Medium', color: 'text-yellow-500 dark:text-yellow-400' };
    return { text: 'Weak', color: 'text-red-500 dark:text-red-400' };
  };

  const generatePassword = () => {
    // ... (generatePassword function remains the same) ...
    let charset = '';
    if (includeUppercase) charset += characterSets.uppercase;
    if (includeLowercase) charset += characterSets.lowercase;
    if (includeNumbers) charset += characterSets.numbers;
    if (includeSymbols) charset += characterSets.symbols;

    if (charset === '') {
      toast.error('Please select at least one character type.');
      setPassword('');
      setStrength({ text: 'N/A', color: 'text-muted-foreground' });
      return;
    }

    let newPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setStrength(calculateStrength(newPassword));
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleCopyToClipboard = () => {
    // ... (handleCopyToClipboard function remains the same) ...
    if (!password) {
        toast.error('Nothing to copy!');
        return;
    }
    navigator.clipboard.writeText(password)
      .then(() => {
        toast.success('Password copied to clipboard!');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        toast.error('Failed to copy password.');
        console.error('Copy failed', err);
      });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        {/* ... (CardHeader content remains the same) ... */}
        <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-full">
                <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <div>
                <CardTitle className="text-xl font-semibold">Strong Password Generator</CardTitle>
                <CardDescription className="text-xs mt-1">Create secure and random passwords.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Generated Password Display */}
        <div className="relative">
          {/* ... (Input and inline buttons remain the same) ... */}
           <Input
            type="text"
            value={password}
            readOnly
            placeholder="Click Generate or adjust options"
            className="pr-20 text-lg tracking-wider font-mono h-12"
            aria-label="Generated Password"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
             <Button variant="ghost" size="icon" onClick={generatePassword} aria-label="Generate new password">
                <RefreshCw className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} aria-label="Copy password">
                {copied ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-muted-foreground hover:text-primary" />}
            </Button>
          </div>
        </div>

        {/* Password Strength Indicator */}
        {password && (
            <div className="text-sm flex items-center justify-between">
                <span>Password Strength:</span>
                <span className={`font-semibold ${strength.color}`}>{strength.text}</span>
            </div>
        )}

        {/* --- Prompt to Save to Data Vault --- */}
        {password && (strength.text === 'Strong' || strength.text === 'Very Strong') && (
          <div className="mt-4 p-3 border border-blue-500/30 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm">
            <div className="flex items-start gap-2">
              <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-300">
                  Strong password generated!
                </p>
                <p className="text-blue-600/90 dark:text-blue-400/90 mt-1">
                  Don't want to forget it? Add this to your Privmat Data Vault.
                </p>
                <Link href="/data-vault/add-new-data" className="mt-2 inline-block">
                  <Button size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-800/50">
                    Save to Vault
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
        {/* ------------------------------------- */}

        {/* Options (Password Length, Character Types) */}
        <div className="space-y-4 pt-2"> {/* Added pt-2 for spacing */}
          {/* ... (Slider and Checkboxes remain the same) ... */}
           <div>
            <Label htmlFor="passwordLength" className="text-sm font-medium">
              Password Length: {passwordLength}
            </Label>
            <Slider
              id="passwordLength"
              min={8}
              max={64}
              step={1}
              value={[passwordLength]}
              onValueChange={(value) => setPasswordLength(value[0])}
              className="mt-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="includeUppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
              <Label htmlFor="includeUppercase" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Uppercase (A-Z)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="includeLowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
              <Label htmlFor="includeLowercase" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Lowercase (a-z)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="includeNumbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
              <Label htmlFor="includeNumbers" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Numbers (0-9)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="includeSymbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
              <Label htmlFor="includeSymbols" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Symbols (!@#$)</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordGenerator;