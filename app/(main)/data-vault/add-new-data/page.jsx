// components/AddNewData.jsx
"use client";

import { useState } from 'react';
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react'; // Import Loader2 for loading indicator
import VaultPasswordPrompt from "@/components/VaultPasswordPrompt"; // Assuming this component exists
import toast from 'react-hot-toast'; // Import toast

const AddNewData = () => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [newVaultItem, setNewVaultItem] = useState({
    website: "",
    username: "",
    password: "",
    notes: "",
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    setNewVaultItem({ ...newVaultItem, [e.target.name]: e.target.value });
  };

  // Basic validation
  const validateForm = () => {
      if (!newVaultItem.website || !newVaultItem.username || !newVaultItem.password) {
          toast.error("Website, Username, and Password are required.");
          return false;
      }
      return true;
  }

  const handleAddNewItem = () => {
      if (validateForm()) {
          setShowPasswordPrompt(true);
      }
  };

  const handleConfirmVaultPassword = async (vaultPassword) => {
    setIsLoading(true); // Start loading
    setShowPasswordPrompt(false); // Close prompt immediately

    // Prepare data structure as expected by vaultEncrypt (if using combined method)
    const dataToEncrypt = {
        website: newVaultItem.website,
        username: newVaultItem.username,
        password: newVaultItem.password,
        notes: newVaultItem.notes || '', // Ensure notes is at least an empty string
    };

    try {
      // Using App Router convention for API route: /api/vault/route.js
      const response = await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send the vault password AND the data to be encrypted
        body: JSON.stringify({ vaultPassword, data: dataToEncrypt }),
      });

      const result = await response.json(); // Always try to parse JSON

      if (!response.ok) {
          // Use toast for errors
          toast.error(result.error || "Something went wrong saving the credential.");
          // No need to return here, finally block will run
      } else {
          toast.success(result.message || "Credential saved successfully!");
          router.push('/data-vault'); // Redirect on success
      }
    } catch (err) {
      console.error("Failed to save vault item:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
      // Don't hide prompt here, do it when confirm starts
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-30 md:py-34 lg:py-42">
      <Card className="abc w-auto max-w-2xl mx-auto overflow-hidden">
        <CardHeader>
          <CardTitle>Add New Credential</CardTitle>
          <CardDescription>Securely store a new website credential.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 items-center justify-center  ">
          {/* Website Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website" className="text-right">
              Application <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text" id="website" name="website"
              value={newVaultItem.website} onChange={handleInputChange}
              className="col-span-3" required
            />
          </div>
          {/* Username Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text" id="username" name="username"
              value={newVaultItem.username} onChange={handleInputChange}
              className="col-span-3" required
            />
          </div>
          {/* Password Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              type="password" id="password" name="password"
              value={newVaultItem.password} onChange={handleInputChange}
              className="col-span-3" required
            />
          </div>
          {/* Notes Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Input // Or use Textarea for multi-line notes
              type="text" id="notes" name="notes"
              value={newVaultItem.notes} onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className='flex items-center justify-between mt-4'>
            <Link href="/data-vault">
              <Button variant="link" className="gap-2 pl-0" disabled={isLoading}>
                <ArrowLeft className="h-4 w-4" />
                Back to Data Vault
              </Button>
            </Link>
            <Button onClick={handleAddNewItem} className="ml-auto" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Creating...' : 'Create Vault Item'}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Vault Password Prompt */}
      <VaultPasswordPrompt
        open={showPasswordPrompt}
        onConfirm={handleConfirmVaultPassword}
        onCancel={() => setShowPasswordPrompt(false)} // Allow cancelling the prompt
      />
    </div>
  );
};

export default AddNewData;