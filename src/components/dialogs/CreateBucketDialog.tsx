
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircleIcon } from "lucide-react";
import Loader from "@/components/ui/Loader";

interface CreateBucketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBucket: (name: string) => Promise<void>;
}

const CreateBucketDialog: React.FC<CreateBucketDialogProps> = ({ 
  isOpen, 
  onClose, 
  onCreateBucket 
}) => {
  const [bucketName, setBucketName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!bucketName.trim()) {
      setError("Bucket name cannot be empty");
      return;
    }
    
    if (!/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(bucketName)) {
      setError("Bucket name can only contain lowercase letters, numbers, periods, and hyphens. It must start and end with a letter or number.");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await onCreateBucket(bucketName);
      setBucketName("");
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    if (!isSubmitting) {
      setBucketName("");
      setError(null);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] animate-fade-in">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Bucket</DialogTitle>
            <DialogDescription>
              Enter a name for your new storage bucket.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bucket Name</Label>
              <Input
                id="name"
                placeholder="e.g., my-bucket"
                value={bucketName}
                onChange={(e) => {
                  setBucketName(e.target.value);
                  setError(null);
                }}
                className={error ? "border-destructive" : ""}
                disabled={isSubmitting}
                autoComplete="off"
              />
              {error && (
                <div className="flex items-center text-xs text-destructive mt-1 gap-1">
                  <AlertCircleIcon className="h-3 w-3" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader size="small" className="mr-2" />}
              Create Bucket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBucketDialog;
