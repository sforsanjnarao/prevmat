"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { LockKeyhole, ChevronRightIcon } from 'lucide-react';
import { Loader2 } from "lucide-react";
const Vault = () => {
  const [vaultItems, setVaultItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVaultItems = async () => {
      try {
        const res = await fetch("/api/vault");
        if (!res.ok) throw new Error("Failed to fetch vault items");
        const data = await res.json();
        setVaultItems(data);
        setFilteredItems(data);
      } catch (err) {
        console.error("Fetch error:", err); // Log detailed error
        setError("Failed to load vault items. Please try again later."); // User-friendly message
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaultItems();
  }, []);

  useEffect(() => {
    const filtered = vaultItems.filter((item) =>
      item.website.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, vaultItems]);

  const handleItemClick = (id) => {
    router.push(`/data-vault/${id}`);
  };
  const handleAddNewCredential = () => {
    router.push("/data-vault/add-new-data");
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>{vaultItems.length} sites and apps</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="flex items-center gap-2 border rounded-md px-3 py-2">
          <Search aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search passwords"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Vault Items List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2">Loading...</span>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : vaultItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Your vault is empty.</p>
            <Button variant="outline" className="mt-4" onClick={handleAddNewCredential}>
              Add Your First Credential
            </Button>
          </div>
        ) : filteredItems.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {filteredItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer border rounded-md"
              >
                <div className="flex items-center gap-3">
                  <LockKeyhole aria-hidden="true" className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.website}</span>
                </div>
                <ChevronRightIcon aria-hidden="true" className="w-4 h-4 text-muted-foreground" />
              </li>
            ))}
          </ul>
        ) : (
          <p>No matching results.</p>
        )}
      </CardContent>

      <div className="flex justify-end p-4">
        <Button variant="outline" onClick={handleAddNewCredential}>Add New Credential</Button>
      </div>
    </Card>
  );
};

export default Vault;