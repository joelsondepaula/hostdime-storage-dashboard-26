import React, { useState } from "react";
import { 
  ArrowLeftIcon, 
  FileIcon, 
  UploadIcon, 
  MoreVerticalIcon,
  Download, 
  Clipboard, 
  Link2Icon, 
  TrashIcon,
  ArrowDownIcon, 
  ArrowUpIcon,
  FileTextIcon,
  FileImageIcon,
  FileArchiveIcon,
  FileCodeIcon,
  TableIcon,
  FileBadgeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { StorageObject, formatBytes, formatDate } from "@/utils/api";
import { PageLoader } from "@/components/ui/Loader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import UploadObjectDialog from "@/components/dialogs/UploadObjectDialog";

interface ObjectListProps {
  bucketName: string;
  objects: StorageObject[] | null;
  isLoading: boolean;
  onBack: () => void;
  onObjectUpload: (file: File) => Promise<void>;
  onObjectDelete: (objectKey: string) => Promise<void>;
}

type SortField = "key" | "lastModified" | "size" | "type";
type SortOrder = "asc" | "desc";

const ObjectList: React.FC<ObjectListProps> = ({
  bucketName,
  objects,
  isLoading,
  onBack,
  onObjectUpload,
  onObjectDelete
}) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>("key");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <FileImageIcon className="h-4 w-4 text-blue-500" />;
    } else if (type.startsWith("video/")) {
      return <TableIcon className="h-4 w-4 text-purple-500" />;
    } else if (type.startsWith("audio/")) {
      return <FileBadgeIcon className="h-4 w-4 text-green-500" />;
    } else if (type.includes("pdf")) {
      return <FileTextIcon className="h-4 w-4 text-red-500" />;
    } else if (type.includes("zip") || type.includes("archive") || type.includes("compressed")) {
      return <FileArchiveIcon className="h-4 w-4 text-yellow-500" />;
    } else if (type.includes("html") || type.includes("json") || type.includes("xml") || type.includes("javascript")) {
      return <FileCodeIcon className="h-4 w-4 text-gray-500" />;
    } else {
      return <FileIcon className="h-4 w-4 text-hostdime-blue" />;
    }
  };
  
  const getSortedObjects = () => {
    if (!objects) return [];
    
    return [...objects].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "key":
          comparison = a.key.localeCompare(b.key);
          break;
        case "lastModified":
          comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
          break;
        case "size":
          comparison = a.size - b.size;
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };
  
  const sortedObjects = getSortedObjects();
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={onBack} className="flex items-center gap-1 text-muted-foreground">
                  <ArrowLeftIcon className="h-3 w-3" />
                  <span>Buckets</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="font-medium">{bucketName}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-semibold tracking-tight">{bucketName}</h1>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <UploadIcon className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
      </div>
      
      <div className="glass-panel overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm text-muted-foreground">
          <div className="col-span-4 sm:col-span-6 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort("key")}>
            <span>Name</span>
            {sortField === "key" && (
              sortOrder === "asc" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />
            )}
          </div>
          <div className="col-span-3 sm:col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort("lastModified")}>
            <span>Modified</span>
            {sortField === "lastModified" && (
              sortOrder === "asc" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />
            )}
          </div>
          <div className="col-span-2 sm:col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort("size")}>
            <span>Size</span>
            {sortField === "size" && (
              sortOrder === "asc" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />
            )}
          </div>
          <div className="hidden sm:flex sm:col-span-1 items-center gap-1 cursor-pointer" onClick={() => toggleSort("type")}>
            <span>Type</span>
            {sortField === "type" && (
              sortOrder === "asc" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />
            )}
          </div>
          <div className="col-span-3 sm:col-span-1"></div>
        </div>
        
        {sortedObjects.length === 0 ? (
          <div className="py-16 text-center">
            <FileIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground/60" />
            <h3 className="font-medium text-lg mb-1">No objects</h3>
            <p className="text-muted-foreground mb-4">This bucket is empty.</p>
            <Button size="sm" onClick={() => setIsUploadDialogOpen(true)}>
              <UploadIcon className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {sortedObjects.map((object) => (
              <div key={object.key} className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/20 transition-colors">
                <div className="col-span-4 sm:col-span-6 flex items-center gap-3">
                  <div className="bg-hostdime-light p-2 rounded">
                    {getFileIcon(object.type)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="font-medium truncate">
                      {object.key}
                    </div>
                    <div className="text-xs text-muted-foreground block sm:hidden">
                      {formatDate(object.lastModified)}
                    </div>
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-2 flex items-center text-muted-foreground text-sm">
                  <span className="hidden sm:inline">{formatDate(object.lastModified)}</span>
                </div>
                <div className="col-span-2 sm:col-span-2 flex items-center text-muted-foreground text-sm">
                  {formatBytes(object.size)}
                </div>
                <div className="hidden sm:flex sm:col-span-1 items-center text-muted-foreground text-sm">
                  {object.type.split('/').pop()}
                </div>
                <div className="col-span-3 sm:col-span-1 flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVerticalIcon className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Download</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Clipboard className="mr-2 h-4 w-4" />
                        <span>Copy URL</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link2Icon className="mr-2 h-4 w-4" />
                        <span>Share</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => onObjectDelete(object.key)}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <UploadObjectDialog 
        isOpen={isUploadDialogOpen} 
        onClose={() => setIsUploadDialogOpen(false)}
        bucketName={bucketName}
        onUpload={onObjectUpload}
      />
    </div>
  );
};

export default ObjectList;
