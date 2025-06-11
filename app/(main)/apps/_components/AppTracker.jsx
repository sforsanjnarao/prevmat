// components/AppTracker.jsx

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog" // For Delete Confirmation
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import toast from 'react-hot-toast';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { calculateOverallRisk } from '@/lib/riskCalculator';

const AppTracker = () => {
    // State variables
  const [trackedApps, setTrackedApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Separate loading for submission
  const [error, setError] = useState(null);

    // State for Add New App dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAppData, setNewAppData] = useState({
    name: "",
    url: "",
    emailUsed: "",
    phoneUsed: "",
    locationAccess: false,
    notes: "",
  });

    // --- State for Edit Dialog ---
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null); // Store the whole item being edited
    const [editFormData, setEditFormData] = useState({ emailUsed: "", phoneUsed: "", locationAccess: false, notes: "" });
  
    // --- State for Delete Dialog ---
     const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
     const [itemToDeleteId, setItemToDeleteId] = useState(null);

    //  state for overall risk
    const [overallRisk, setOverallRisk] = useState({ score: 0, level: 'Low' });

  // Fetch tracked apps on component mount
  useEffect(() => {
    const fetchTrackedApps = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/apps');  // API now returns { trackedApps: [], overallRisk: {} }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTrackedApps(data.trackedApps || []); // Set the tracked apps array
        setOverallRisk(data.overallRisk || { score: 0, level: 'Low' }); // Set the overall risk object
        } catch (err) {
        console.error("Failed to fetch tracked apps:", err);
        setError(err.message || "Failed to fetch tracked apps");
        toast.error("Failed to load tracked apps.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackedApps();
  }, []);

  // Handle input changes for the "Add New App" form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAppData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle submission of the "Add New App" form
  const handleAddApp = async (e) => {
     e.preventDefault(); // Prevent default form submission if needed
     setIsSubmitting(true);
     setError(null); // Clear previous errors

     if (!newAppData.name) {
        toast.error("App name is required.");
        setIsSubmitting(false);
        return;
     }

     try {
       const response = await fetch('/api/apps', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(newAppData),
       });

       if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
       }

       const newlyAddedAppWithScore = await response.json(); // API now returns score
      // Create the *next* state array
      const nextTrackedApps = [newlyAddedAppWithScore, ...trackedApps];
          
      // Update the tracked apps state
      setTrackedApps(nextTrackedApps);
          
      // --- Recalculate and Update Overall Risk ---
      const newOverallRisk = calculateOverallRisk(nextTrackedApps); // Calculate based on the new array
      setOverallRisk(newOverallRisk); // Update the overall risk state       
      toast.success(`Tracked "${newlyAddedAppWithScore.app.name}" successfully!`);
       setIsAddDialogOpen(false); // Close the dialog
       setNewAppData({ // Reset form
         name: "", url: "", emailUsed: "", phoneUsed: "", locationAccess: false, notes: "",
       });

     } catch (err) {
       console.error("Error adding app:", err);
       setError(err.message);
       toast.error(`Failed to add app: ${err.message}`);
     } finally {
       setIsSubmitting(false);
     }
   };


    // --- Edit Functionality ---
  const openEditDialog = (item) => {
    setEditingItem(item); // Store the full item
    setEditFormData({ // Pre-fill form with existing data
      emailUsed: item.emailUsed || "",
      phoneUsed: item.phoneUsed || "",
      locationAccess: item.locationAccess,
      notes: item.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateApp = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/apps/${editingItem.id}`, { // Use editingItem.id
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData), // Send only editable fields
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedItemWithScore = await response.json(); // API now returns score

      // Create the *next* state array
      const nextTrackedApps = trackedApps.map(item =>
          item.id === updatedItemWithScore.id ? updatedItemWithScore : item
      );

      // Update the tracked apps state
      setTrackedApps(nextTrackedApps);

      // --- Recalculate and Update Overall Risk ---
      const newOverallRisk = calculateOverallRisk(nextTrackedApps);
      setOverallRisk(newOverallRisk);
      toast.success(`Updated "${updatedItemWithScore.app.name}" successfully!`);
      setIsEditDialogOpen(false);
      setEditingItem(null); // Clear editing item

    } catch (err) {
      console.error("Error updating app:", err);
      setError(err.message);
      toast.error(`Failed to update app: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Delete Functionality ---
   const openDeleteDialog = (id) => {
     setItemToDeleteId(id);
     setIsDeleteDialogOpen(true);
   };

   const handleDeleteApp = async () => {
     if (!itemToDeleteId) return;
     setIsSubmitting(true); // Can reuse submitting state or add a new one
     setError(null);

     try {
       const response = await fetch(`/api/apps/${itemToDeleteId}`, {
         method: 'DELETE',
       });

       if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
       }

       // Create the *next* state array
       const nextTrackedApps = trackedApps.filter(item => item.id !== itemToDeleteId);

       // Update the tracked apps state
       setTrackedApps(nextTrackedApps);

       // --- Recalculate and Update Overall Risk ---
       const newOverallRisk = calculateOverallRisk(nextTrackedApps);
       setOverallRisk(newOverallRisk);
       toast.success(`Removed tracked app successfully!`);
       setIsDeleteDialogOpen(false); // Close confirmation dialog
       setItemToDeleteId(null);

     } catch (err) {
       console.error("Error deleting app:", err);
       setError(err.message);
       toast.error(`Failed to remove app: ${err.message}`);
     } finally {
       setIsSubmitting(false);
     }
   };

   // Handle input changes for Edit form
  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Update the EDIT form state
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // Handle checkbox separately if needed, though onCheckedChange is better for checkboxes
    }));
  };
  
  // Helper function for styling based on risk level
  const getRiskColorClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'text-red-700 dark:text-red-500';
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-500';
    }
  };

   // --- Function to handle Dialog open/close ---
   const handleAddDialogOpenChange = (open) => {
    setIsAddDialogOpen(open);
    if (!open) {
      // Clear error and form when dialog closes
      setError(null);
      setNewAppData({ name: "", url: "", emailUsed: "", phoneUsed: "", locationAccess: false, notes: "" });
    }
  };

    // --- Render the component ---
  return (
    <Card className="w-full">
    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"> {/* Adjust layout */}
      {/* Left side: Title and Description */}
      <div>
        <CardTitle>Tracked Applications</CardTitle>
        <CardDescription>Monitor the data shared and associated risks.</CardDescription>
      </div>
      {/* Right side: Overall Risk and Add Button */}
      <div className="flex items-center gap-4">
         {/* Overall Risk Display */}
         {!isLoading && !error && overallRisk && (
             <div className={`text-right p-2 border rounded-md ${getRiskColorClass(overallRisk.level).replace('text-', 'border-').replace('dark:text-', 'dark:border-')}`}>
                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Risk</p>
                 <p className={`text-xl font-bold ${getRiskColorClass(overallRisk.level)}`}>
                     {overallRisk.level} ({overallRisk.score})
                 </p>
             </div>
         )}
        {/* Add New App Dialog Trigger */}
        <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New App
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Track a New App</DialogTitle>
              <DialogDescription>
                Enter the details of the app and the data you've shared.
              </DialogDescription>
            </DialogHeader>
            {/* Add New App Form */}
            <form onSubmit={handleAddApp}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    App Name*
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newAppData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    URL (Optional)
                  </Label>
                  <Input
                    id="url"
                    name="url"
                    value={newAppData.url}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="emailUsed" className="text-right">
                    Email Used
                  </Label>
                  <Input
                    id="emailUsed"
                    name="emailUsed"
                    type="email"
                    value={newAppData.emailUsed}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="user@example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneUsed" className="text-right">
                    Phone Used
                  </Label>
                  <Input
                    id="phoneUsed"
                    name="phoneUsed"
                    value={newAppData.phoneUsed}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="123-456-7890"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="locationAccess" className="text-right">
                    Location Access?
                  </Label>
                  <Checkbox
                    id="locationAccess"
                    name="locationAccess"
                    checked={newAppData.locationAccess}
                    onCheckedChange={(checked) => setNewAppData(prev => ({...prev, locationAccess: checked}))} // Handle Checkbox change
                    className="col-span-3 justify-self-start"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={newAppData.notes}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Any specific details..."
                  />
                </div>
              </div>
              <DialogFooter>
                 {/* Use DialogClose for the cancel button */}
                 <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                 </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save App"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-center py-4">Loading tracked apps...</p>}
        {error && !isLoading && <p className="text-red-500 text-center py-4">Error: {error}</p>}

        {!isLoading && !error && (
          trackedApps.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>A list of apps you are tracking.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>App Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Email Used</TableHead>
                    <TableHead>Phone Used</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trackedApps.map((userApp) =>(
                    <TableRow key={userApp.id}>
                      <TableCell className="font-medium">{userApp.app.name}</TableCell>
                      <TableCell>
                        {userApp.app.url ? (
                          <a href={userApp.app.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {userApp.app.url.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{userApp.emailUsed || '-'}</TableCell>
                      <TableCell>{userApp.phoneUsed || '-'}</TableCell>
                      <TableCell>{userApp.locationAccess ? 'Yes' : 'No'}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={userApp.notes || ''}>
                        {userApp.notes || '-'}
                      </TableCell>
                     <TableCell>
                         <span className={`font-bold px-2 py-1 rounded-full text-xs ${
                             userApp.riskScore >= 21 ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                             userApp.riskScore >= 11 ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' :
                             userApp.riskScore >= 6 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                             'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                         }`}>
                             {userApp.riskScore}
                         </span>
                     </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(userApp)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button> 
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={() => setItemToDeleteId(userApp.id)}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently remove the tracking entry for "{userApp.app.name}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setItemToDeleteId(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteApp}
                                    disabled={isSubmitting}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    {isSubmitting ? "Deleting..." : "Yes, delete it"}
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">You haven't tracked any apps yet. Click "Add New App" to start.</p>
          )
        )}
      </CardContent>

      {/* Edit App Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Tracked App: {editingItem?.app?.name}</DialogTitle>
            <DialogDescription>Update the details for this tracked app.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateApp}>
            <div className="grid gap-4 py-4">
               {/* Email */}
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-emailUsed" className="text-right">Email Used</Label>
                  <Input id="edit-emailUsed" name="emailUsed" type="email" value={editFormData.emailUsed} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              {/* Phone */}
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phoneUsed" className="text-right">Phone</Label>
                  <Input id="edit-phoneUsed" name="phoneUsed" value={editFormData.phoneUsed} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              {/* Location */}
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-locationAccess" className="text-right">Location?</Label>
                  <Checkbox id="edit-locationAccess" name="locationAccess" checked={editFormData.locationAccess} onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, locationAccess: checked }))} className="col-span-3 justify-self-start" />
              </div>
              {/* Notes */}
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-notes" className="text-right">Notes</Label>
                  <Textarea id="edit-notes" name="notes" value={editFormData.notes} onChange={handleEditInputChange} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </Card>
  );
};

export default AppTracker;