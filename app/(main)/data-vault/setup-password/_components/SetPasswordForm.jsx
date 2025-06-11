"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SetPasswordForm() {
  const [vaultPassword, setVaultPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleSavePassword = async () => {
    setLoading(true);
    setStatus(null);

    const res = await fetch('/api/vault-password', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: vaultPassword }),
    });

    setLoading(false);
    if (res.ok) {
      setVaultPassword("");
      setStatus("success");
      // ✅ Redirect after slight delay (optional)
      setTimeout(() => {
        router.push("/data-vault");
      }, 1000);
    } else {
      setStatus("error");
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Set Your Data Vault Password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="password"
          placeholder="Enter new vault password"
          value={vaultPassword}
          onChange={(e) => setVaultPassword(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
            NOTE: This password will be used to encrypt your data. Make sure to remember it.
            <br />
            If you lose it, you won't be able to access your vault.
        </p>
        <Button onClick={handleSavePassword} disabled={loading}>
          {loading ? "Saving..." : "Save Password"}
        </Button>
        {status === "success" && (
          <p className="text-green-600 text-sm">Vault password updated successfully!</p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-sm">Error updating vault password.</p>
        )}
      </CardContent>
    </Card>
  );
}
