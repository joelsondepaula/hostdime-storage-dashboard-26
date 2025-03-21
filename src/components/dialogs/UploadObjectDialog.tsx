
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadIcon, FileIcon, XIcon, AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { formatBytes } from "@/utils/api";

interface UploadObjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bucketName: string;
  onUpload: (file: File) => Promise<void>;
}

const UploadObjectDialog: React.FC<UploadObjectDialogProps> = ({
  isOpen,
  onClose,
  bucketName,
  onUpload
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      
      // Reset the input so the same file can be selected again
      event.target.value = '';
      
      // Initialize progress for new files
      setUploadProgress((prev) => [
        ...prev,
        ...Array(filesArray.length).fill(0)
      ]);
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadProgress((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one file");
      return;
    }
    
    setError(null);
    setUploading(true);
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        setCurrentFileIndex(i);
        
        // Simulate progress updates
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress((prev) => {
            const newProgress = [...prev];
            newProgress[i] = progress;
            return newProgress;
          });
          
          if (progress < 100) {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
        }
        
        await onUpload(selectedFiles[i]);
      }
      
      setSelectedFiles([]);
      setUploadProgress([]);
      setCurrentFileIndex(null);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred during upload");
      }
    } finally {
      setUploading(false);
    }
  };
  
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      
      // Initialize progress for new files
      setUploadProgress((prev) => [
        ...prev,
        ...Array(filesArray.length).fill(0)
      ]);
    }
  };
  
  const handleClose = () => {
    if (!uploading) {
      setSelectedFiles([]);
      setUploadProgress([]);
      setCurrentFileIndex(null);
      setError(null);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] animate-fade-in">
        <DialogHeader>
          <DialogTitle>Upload to {bucketName}</DialogTitle>
          <DialogDescription>
            Select files to upload to your bucket.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          
          <div
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={handleClickUpload}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <UploadIcon className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">Drag and drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground">Upload multiple files of any type</p>
          </div>
          
          {error && (
            <div className="flex items-center text-xs text-destructive mt-3 gap-1">
              <AlertCircleIcon className="h-3 w-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {selectedFiles.length > 0 && (
            <div className="mt-4 max-h-[200px] overflow-y-auto">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
              </p>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between gap-2 p-2 border rounded-md">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentFileIndex === index && uploading ? (
                        <div className="text-xs font-medium text-primary">
                          {uploadProgress[index]}%
                        </div>
                      ) : uploadProgress[index] === 100 ? (
                        <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          disabled={uploading}
                        >
                          <XIcon className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" type="button" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button type="button" onClick={handleUpload} disabled={uploading || selectedFiles.length === 0}>
            {uploading && <Loader size="small" className="mr-2" />}
            Upload{selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadObjectDialog;
