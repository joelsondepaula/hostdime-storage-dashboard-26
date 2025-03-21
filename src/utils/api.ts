
// Mock data and API functions for MinIO
import { toast } from "@/components/ui/use-toast";

export interface Bucket {
  name: string;
  creationDate: string;
  objectCount: number;
  size: number;
}

export interface StorageObject {
  key: string;
  lastModified: string;
  size: number;
  etag: string;
  type: string;
}

export interface StorageUsage {
  total: number;
  used: number;
  free: number;
}

// Mock data
const mockBuckets: Bucket[] = [
  {
    name: "documentos",
    creationDate: "2023-05-15T09:24:00Z",
    objectCount: 152,
    size: 1073741824 // 1GB
  },
  {
    name: "imagens",
    creationDate: "2023-06-22T14:30:00Z",
    objectCount: 567,
    size: 5368709120 // 5GB
  },
  {
    name: "backups",
    creationDate: "2023-04-10T11:15:00Z",
    objectCount: 42,
    size: 10737418240 // 10GB
  },
  {
    name: "logs",
    creationDate: "2023-07-05T08:45:00Z",
    objectCount: 1243,
    size: 536870912 // 512MB
  }
];

const mockObjects: Record<string, StorageObject[]> = {
  "documentos": [
    { key: "relatorio-2023.pdf", lastModified: "2023-08-15T09:24:00Z", size: 5242880, etag: "abc123", type: "application/pdf" },
    { key: "contrato.docx", lastModified: "2023-08-10T14:30:00Z", size: 2097152, etag: "def456", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    { key: "apresentacao.pptx", lastModified: "2023-07-22T11:15:00Z", size: 10485760, etag: "ghi789", type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" }
  ],
  "imagens": [
    { key: "perfil.jpg", lastModified: "2023-08-20T15:45:00Z", size: 1048576, etag: "jkl012", type: "image/jpeg" },
    { key: "banner.png", lastModified: "2023-08-18T12:30:00Z", size: 2097152, etag: "mno345", type: "image/png" },
    { key: "logo.svg", lastModified: "2023-08-05T09:15:00Z", size: 524288, etag: "pqr678", type: "image/svg+xml" }
  ],
  "backups": [
    { key: "database-2023-08-20.sql", lastModified: "2023-08-20T00:00:00Z", size: 1073741824, etag: "stu901", type: "application/sql" },
    { key: "arquivos-2023-08-13.zip", lastModified: "2023-08-13T00:00:00Z", size: 2147483648, etag: "vwx234", type: "application/zip" }
  ],
  "logs": [
    { key: "acesso-2023-08-20.log", lastModified: "2023-08-20T23:59:59Z", size: 10485760, etag: "yza567", type: "text/plain" },
    { key: "erro-2023-08-20.log", lastModified: "2023-08-20T23:59:59Z", size: 5242880, etag: "bcd890", type: "text/plain" }
  ]
};

const mockUsage: StorageUsage = {
  total: 107374182400, // 100GB
  used: 17179869184,   // 16GB
  free: 90194313216    // 84GB
};

// Mock API functions with artificial delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchBuckets = async (): Promise<Bucket[]> => {
  await delay(800);
  return [...mockBuckets];
};

export const fetchObjects = async (bucketName: string): Promise<StorageObject[]> => {
  await delay(600);
  return mockObjects[bucketName] || [];
};

export const fetchUsage = async (): Promise<StorageUsage> => {
  await delay(500);
  return { ...mockUsage };
};

export const createBucket = async (name: string): Promise<Bucket> => {
  await delay(1000);
  
  // Check if bucket already exists
  if (mockBuckets.some(b => b.name === name)) {
    throw new Error(`Bucket '${name}' já existe`);
  }
  
  const newBucket: Bucket = {
    name,
    creationDate: new Date().toISOString(),
    objectCount: 0,
    size: 0
  };
  
  mockBuckets.push(newBucket);
  mockObjects[name] = [];
  
  toast({
    title: "Bucket Criado",
    description: `Bucket '${name}' foi criado com sucesso.`,
  });
  
  return newBucket;
};

export const deleteBucket = async (name: string): Promise<void> => {
  await delay(1000);
  
  const index = mockBuckets.findIndex(b => b.name === name);
  if (index === -1) {
    throw new Error(`Bucket '${name}' não encontrado`);
  }
  
  mockBuckets.splice(index, 1);
  delete mockObjects[name];
  
  toast({
    title: "Bucket Excluído",
    description: `Bucket '${name}' foi excluído com sucesso.`,
  });
};

export const uploadObject = async (bucketName: string, file: File): Promise<StorageObject> => {
  await delay(1500);
  
  if (!mockBuckets.some(b => b.name === bucketName)) {
    throw new Error(`Bucket '${bucketName}' não encontrado`);
  }
  
  const newObject: StorageObject = {
    key: file.name,
    lastModified: new Date().toISOString(),
    size: file.size,
    etag: Math.random().toString(36).substring(2, 10),
    type: file.type
  };
  
  if (!mockObjects[bucketName]) {
    mockObjects[bucketName] = [];
  }
  
  // Update bucket size
  const bucketIndex = mockBuckets.findIndex(b => b.name === bucketName);
  mockBuckets[bucketIndex].size += file.size;
  mockBuckets[bucketIndex].objectCount += 1;
  
  // Update usage
  mockUsage.used += file.size;
  mockUsage.free -= file.size;
  
  mockObjects[bucketName].push(newObject);
  
  toast({
    title: "Upload Concluído",
    description: `${file.name} foi enviado com sucesso.`,
  });
  
  return newObject;
};

export const deleteObject = async (bucketName: string, objectKey: string): Promise<void> => {
  await delay(800);
  
  if (!mockBuckets.some(b => b.name === bucketName)) {
    throw new Error(`Bucket '${bucketName}' não encontrado`);
  }
  
  const objectIndex = mockObjects[bucketName]?.findIndex(o => o.key === objectKey);
  if (objectIndex === undefined || objectIndex === -1) {
    throw new Error(`Objeto '${objectKey}' não encontrado no bucket '${bucketName}'`);
  }
  
  const objectSize = mockObjects[bucketName][objectIndex].size;
  
  // Update bucket size
  const bucketIndex = mockBuckets.findIndex(b => b.name === bucketName);
  mockBuckets[bucketIndex].size -= objectSize;
  mockBuckets[bucketIndex].objectCount -= 1;
  
  // Update usage
  mockUsage.used -= objectSize;
  mockUsage.free += objectSize;
  
  mockObjects[bucketName].splice(objectIndex, 1);
  
  toast({
    title: "Objeto Excluído",
    description: `${objectKey} foi excluído com sucesso.`,
  });
};

// Helper utilities for formatting
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
