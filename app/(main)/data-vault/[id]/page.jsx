// app/data-vault/[id]/page.jsx (assuming App Router)
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Add useRouter
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { vaultDecrypt, vaultEncrypt } from '@/lib/vault-crypto'; // Use updated function
import { Eye, EyeOff, Copy, ArrowLeft, Loader2, Pencil, Trash } from 'lucide-react'; // Add Pencil, Trash
import toast from 'react-hot-toast';
import Link from 'next/link'; // Import Link
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const VaultDetails = () => {
    const params = useParams();
    const router = useRouter(); // Initialize router
    const vaultId = params?.id;

    const [vaultPassword, setVaultPassword] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [decryptedData, setDecryptedData] = useState(null); // Will hold { username, password, website, notes }
    const [vaultItem, setVaultItem] = useState(null); // Holds fetched encrypted data { id, website, encryptedData, salt, iv }
    const [isLoading, setIsLoading] = useState(true); // Loading state for fetch
    const [isUnlocking, setIsUnlocking] = useState(false); // Loading state for unlock
    const [showPassword, setShowPassword] = useState(false);

    // State for Edit Mode
    const [isEditing, setIsEditing] = useState(false);
    const [editVaultItem, setEditVaultItem] = useState({ website: '', username: '', password: '', notes: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUpdatePasswordDialogOpen, setIsUpdatePasswordDialogOpen] = useState(false);
    const [updatePassword, setUpdatePassword] = useState('');

    // State for Delete Confirmation
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    useEffect(() => {
        const fetchVaultItem = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/vault/${vaultId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch credential');
                }
                const data = await response.json();
                setVaultItem(data);
            } catch (err) {
                console.error(err);
                toast.error(`Failed to load vault item: ${err.message}`);
                // router.push('/data-vault'); // Optionally redirect
            } finally {
                setIsLoading(false);
            }
        };

        if (vaultId) fetchVaultItem();
        else setIsLoading(false);

    }, [vaultId, router]);

    useEffect(() => {
        if (isVerified && decryptedData) {
            setEditVaultItem({ ...decryptedData });
        }
    }, [isVerified, decryptedData]);

    const handleUnlock = async () => {
        if (!vaultPassword || !vaultItem) {
            toast.error("Please enter the vault password.");
            return;
        }
        setIsUnlocking(true);

        try {
            const decrypted = await vaultDecrypt(vaultPassword, {
                encryptedData: vaultItem.encryptedData,
                salt: vaultItem.salt,
                iv: vaultItem.iv,
            });

            setDecryptedData(decrypted);
            setIsVerified(true);
            toast.success('Vault unlocked successfully!');
            setVaultPassword('');

        } catch (err) {
            console.error("Decryption failed:", err);
            if (err.message.includes("Invalid password or corrupted data")) {
                toast.error("Incorrect vault password or data is corrupted.");
            } else if (err.message.includes("data format is invalid")) {
                toast.error("Data decrypted but format is incorrect. Contact support.");
            } else {
                toast.error('Failed to unlock vault. Please try again.');
            }
            setDecryptedData(null);
            setIsVerified(false);
        } finally {
            setIsUnlocking(false);
        }
    };

    const handleCopy = (textToCopy) => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy)
            .then(() => toast.success('Copied to clipboard!'))
            .catch(err => toast.error('Failed to copy!'));
    };

    const handleEditChange = (e) => {
        setEditVaultItem({ ...editVaultItem, [e.target.name]: e.target.value });
    };

    const handleStartEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditVaultItem({ ...decryptedData }); // Revert to original decrypted data
    };

    const handleOpenUpdatePasswordDialog = () => {
        setIsUpdatePasswordDialogOpen(true);
    };

    const handleConfirmUpdatePassword = async () => {
        if (!updatePassword) {
            toast.error("Please enter your vault password to save changes.");
            return;
        }
        setIsUpdating(true);
        setIsUpdatePasswordDialogOpen(false); // Close the dialog

        try {
            const response = await fetch(`/api/vault/${vaultId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vaultPassword: updatePassword, data: editVaultItem }),
            });

            const result = await response.json();
            if (!response.ok) {
                toast.error(result.error || "Failed to update vault item.");
            } else {
                toast.success(result.message || "Vault item updated successfully!");
                setIsEditing(false);
                // Optimistically update the UI
                setVaultItem({ ...vaultItem, website: editVaultItem.website });
                setDecryptedData(editVaultItem);
            }
        } catch (error) {
            console.error("Error updating vault item:", error);
            toast.error("An error occurred while updating.");
        } finally {
            setIsUpdating(false);
            setUpdatePassword(''); // Clear password after attempt
        }
    };

    const handleDelete = async () => {
        if (!deletePassword) {
            toast.error("Please enter your vault password to confirm deletion.");
            return;
        }
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/vault/${vaultId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vaultPassword: deletePassword }),
            });

            const result = await response.json();
            if (!response.ok) {
                toast.error(result.error || "Failed to delete vault item.");
            } else {
                toast.success(result.message || "Vault item deleted successfully!");
                router.push('/data-vault'); // Redirect to vault list after deletion
            }
        } catch (error) {
            console.error("Error deleting vault item:", error);
            toast.error("An error occurred while deleting.");
        } finally {
            setIsDeleting(false);
            setDeletePassword(''); // Clear password after attempt
            setIsDeleteDialogOpen(false); // Close the dialog
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!vaultItem && !isLoading) {
        return (
            <div className="max-w-xl mx-auto mt-10 text-center py-30 md:py-34 lg:py-42 px-4 md:px-6">
                <p className="text-red-500 mb-4">Could not load the vault item.</p>
                <Link href="/data-vault">
                    <Button variant="outline">Back to Vault</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-10 py-30 md:py-34 lg:py-42 px-4 md:px-6">
            <Link href="/data-vault" className="mb-4 inline-block">
                <Button variant="link" className="gap-2 pl-0">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Data Vault
                </Button>
            </Link>
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>{vaultItem?.website || 'Vault Item'}</CardTitle>
                    <div>
                        {isVerified && !isEditing && (
                            <Button variant="outline" size="icon" className="mr-2" onClick={handleStartEdit}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}
                        {isVerified && (
                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Confirm Deletion</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="delete-password-dialog" className="text-right">
                                                Vault Password
                                            </Label>
                                            <Input
                                                id="delete-password-dialog"
                                                type="password"
                                                value={deletePassword}
                                                onChange={(e) => setDeletePassword(e.target.value)}
                                                className="col-span-3"
                                                placeholder="Enter vault password to delete"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Delete
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                    {!isVerified && <CardDescription>Enter your vault password to view credentials</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isVerified ? (
                        <>
                            <Input
                                type="password"
                                placeholder="Enter Vault Password"
                                value={vaultPassword}
                                onChange={(e) => setVaultPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                                disabled={isUnlocking}
                            />
                            <Button onClick={handleUnlock} disabled={isUnlocking || !vaultPassword}>
                                {isUnlocking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isUnlocking ? 'Unlocking...' : 'Unlock'}
                            </Button>
                        </>
                    ) : isEditing ? (
                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="website" className="text-xs font-medium text-muted-foreground">Application</Label>
                                <Input id="website" name="website" value={editVaultItem.website} onChange={handleEditChange} />
                            </div>
                            <div>
                                <Label htmlFor="username" className="text-xs font-medium text-muted-foreground">Username</Label>
                                <Input id="username" name="username" value={editVaultItem.username} onChange={handleEditChange} />
                            </div>
                            <div>
                                <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">Password</Label>
                                <Input id="password" name="password" type="password" value={editVaultItem.password} onChange={handleEditChange} />
                            </div>
                            <div>
                                <Label htmlFor="notes" className="text-xs font-medium text-muted-foreground">Notes</Label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={editVaultItem.notes}
                                    onChange={handleEditChange}
                                    className="mt-1 w-full p-2 border rounded-md bg-background min-h-[60px] text-sm"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                                <Dialog open={isUpdatePasswordDialogOpen} onOpenChange={setIsUpdatePasswordDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button disabled={isUpdating}>
                                            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Save
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Confirm Vault Password</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="update-password-dialog" className="text-right">
                                                    Vault Password
                                                </Label>
                                                <Input
                                                    id="update-password-dialog"
                                                    type="password"
                                                    value={updatePassword}
                                                    onChange={(e) => setUpdatePassword(e.target.value)}
                                                    className="col-span-3"
                                                    placeholder="Enter vault password to save"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="secondary" onClick={() => setIsUpdatePasswordDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" onClick={handleConfirmUpdatePassword} disabled={isUpdating}>
                                                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                Confirm Save
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 bg-muted p-4 rounded-md border">
                            <div>
                                <Label className="text-xs font-medium text-muted-foreground">Username</Label>
                                <div className="flex items-center space-x-2">
                                    <Input readOnly value={decryptedData.username} className="flex-grow bg-background" />
                                    <Button size="icon" variant="ghost" onClick={() => handleCopy(decryptedData.username)}>
                                        <Copy size={16} />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-muted-foreground">Password</Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        readOnly
                                        type={showPassword ? 'text' : 'password'}
                                        value={decryptedData.password}
                                        className="flex-grow bg-background"
                                    />
                                    <Button size="icon" variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleCopy(decryptedData.password)}>
                                        <Copy size={16} />
                                    </Button>
                                </div>
                            </div>

                            {decryptedData.website && vaultItem.website !== decryptedData.website && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground">Website URL</Label>
                                    <div className="flex items-center space-x-2">
                                        <Input readOnly value={decryptedData.website} className="flex-grow bg-background" />
                                        <Button size="icon" variant="ghost" onClick={() => handleCopy(decryptedData.website)}>
                                            <Copy size={16} />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {decryptedData.notes && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground">Notes</Label>
                                    <textarea
                                        readOnly
                                        value={decryptedData.notes}
                                        className="mt-1 w-full p-2 border rounded-md bg-background min-h-[60px] text-sm"
                                        rows={3}
                                    />
                                </div>
                            )}
                            {!decryptedData.notes && (
                                <div>
                                    <Label className="text-xs font-medium text-muted-foreground">Notes</Label>
                                    <p className="text-sm text-muted-foreground italic">No notes added.</p>
                                </div>
                            )}
                        </div>
                    )}
                    {isVerified && !isEditing && (
                        <div className="flex justify-between items-center mt-6 pt-4 border-t">
                            <span className="text-xs text-muted-foreground">Created: {new Date(vaultItem.createdAt).toLocaleDateString()}</span>
                            {/* Edit and Delete Buttons are now in the CardHeader */}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default VaultDetails;