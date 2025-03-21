
import React, { useState } from "react";
import { 
  DatabaseIcon, 
  MoreVerticalIcon, 
  PlusIcon, 
  TrashIcon, 
  ArrowDownIcon, 
  ArrowUpIcon, 
  ShareIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bucket, formatBytes, formatDate } from "@/utils/api";
import { PageLoader } from "@/components/ui/Loader";
import CreateBucketDialog from "@/components/dialogs/CreateBucketDialog";

interface BucketListProps {
  buckets: Bucket[] | null;
  isLoading: boolean;
  onBucketSelect: (bucket: string) => void;
  onBucketCreate: (name: string) => Promise<void>;
  onBucketDelete: (name: string) => Promise<void>;
}

type SortField = "name" | "creationDate" | "objectCount" | "size";
type SortOrder = "asc" | "desc";

const BucketList: React.FC<BucketListProps> = ({
  buckets,
  isLoading,
  onBucketSelect,
  onBucketCreate,
  onBucketDelete
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  
  const getSortedBuckets = () => {
    if (!buckets) return [];
    
    return [...buckets].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "creationDate":
          comparison = new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
          break;
        case "objectCount":
          comparison = a.objectCount - b.objectCount;
          break;
        case "size":
          comparison = a.size - b.size;
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };
  
  const sortedBuckets = getSortedBuckets();
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Object Storage</h1>
          <p className="text-muted-foreground">Gerencie seus buckets e objetos</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Criar Bucket
        </Button>
      </div>
      
      <div className="glass-panel overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm text-muted-foreground">
          <div className="col-span-3 sm:col-span-4 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort("name")}>
            <span>Nome</span>
            {sortField === "name" && (
              sortOrder === "asc" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />
            )}
          </div>
          <div className="col-span-3 sm:col-span-3 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort("creationDate")}>
            <span>Criado</span>
            {sortField === "creationDate" && (
              sortOrder === "asc" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />
            )}
          </div>
          <div className="col-span-3 sm:col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort("objectCount")}>
            <span>Objetos</span>
            {sortField === "objectCount" && (
              sortOrder === "asc" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />
            )}
          </div>
          <div className="col-span-2 sm:col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => toggleSort("size")}>
            <span>Tamanho</span>
            {sortField === "size" && (
              sortOrder === "asc" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />
            )}
          </div>
          <div className="col-span-1 sm:col-span-1"></div>
        </div>
        
        {sortedBuckets.length === 0 ? (
          <div className="py-16 text-center">
            <DatabaseIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground/60" />
            <h3 className="font-medium text-lg mb-1">Nenhum bucket</h3>
            <p className="text-muted-foreground mb-4">Você ainda não criou nenhum bucket.</p>
            <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Criar Bucket
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {sortedBuckets.map((bucket) => (
              <div key={bucket.name} className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/20 transition-colors">
                <div className="col-span-3 sm:col-span-4 flex items-center gap-3">
                  <div className="bg-hostdime-light p-2 rounded">
                    <DatabaseIcon className="h-4 w-4 text-hostdime-blue" />
                  </div>
                  <button 
                    className="font-medium hover:text-hostdime-blue truncate text-left"
                    onClick={() => onBucketSelect(bucket.name)}
                  >
                    {bucket.name}
                  </button>
                </div>
                <div className="col-span-3 sm:col-span-3 flex items-center text-muted-foreground text-sm">
                  {formatDate(bucket.creationDate)}
                </div>
                <div className="col-span-3 sm:col-span-2 flex items-center text-muted-foreground text-sm">
                  {bucket.objectCount}
                </div>
                <div className="col-span-2 sm:col-span-2 flex items-center text-muted-foreground text-sm">
                  {formatBytes(bucket.size)}
                </div>
                <div className="col-span-1 sm:col-span-1 flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVerticalIcon className="h-4 w-4" />
                        <span className="sr-only">Mais opções</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onBucketSelect(bucket.name)}>
                        Ver Conteúdo
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ShareIcon className="mr-2 h-4 w-4" />
                        <span>Compartilhar</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => onBucketDelete(bucket.name)}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <CreateBucketDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateBucket={onBucketCreate}
      />
    </div>
  );
};

export default BucketList;
