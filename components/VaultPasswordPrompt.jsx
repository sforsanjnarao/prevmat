"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VaultPasswordPrompt = ({ onConfirm, onCancel, open }) => {
  const [vaultPassword, setVaultPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!vaultPassword) {
      setError("Vault password is required");
      return;
    }
    setError("");
    onConfirm(vaultPassword);
    setVaultPassword("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold">Enter Vault Password</h2>
        <Input
          type="password"
          placeholder="Vault password"
          value={vaultPassword}
          onChange={(e) => setVaultPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => { onCancel(); setVaultPassword(""); }}>Cancel</Button>
          <Button onClick={handleSubmit}>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default VaultPasswordPrompt;
