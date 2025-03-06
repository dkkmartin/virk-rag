export type PaginationParams = {
  skip?: number;
  limit?: number;
  sort_by?: 'last_modified' | 'cvr_number' | 'size';
  order?: 'asc' | 'desc';
};

export type FileInfo = {
  cvr_number: string;
  size_bytes: number;
  size_kb: number;
  last_modified: string;
  age_days: number;
};

export type DetailedFileInfo = {
  size_bytes: number;
  size_kb: number;
  last_modified: string;
  age_days: number;
  path: string;
};

export type SystemInfo = {
  memory: {
    total_gb: number;
    available_gb: number;
    used_percent: number;
  };
  disk: {
    total_gb: number;
    free_gb: number;
    used_percent: number;
  };
  cpu_cores: number;
};

export type Statistics = {
  total_files: number;
  total_size: {
    bytes: number;
    megabytes: number;
  };
  age_distribution: {
    last_day: number;
    last_week: number;
    last_month: number;
    older: number;
  };
  size_distribution: {
    '0-10KB': number;
    '10-50KB': number;
    '50-100KB': number;
    '100KB+': number;
  };
  storage_path: string;
  system_info: {
    disk_usage_percent: number;
    memory_usage_percent: number;
  };
  last_calculated: string;
};

// API Response Types
export type ListFilesResponse = {
  total_files: number;
  total_size_mb: number;
  storage_path: string;
  files: FileInfo[];
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
};

export type FileDetailsResponse = {
  cvr_number: string;
  file_info: DetailedFileInfo;
  content: unknown; // The actual JSON content of the file
};

// Files Statistics
export type FilesStatistics = {
  today: number;
  this_week: number;
  this_month: number;
  this_year: number;
  total: number;
  timestamp: string;
};

export type FileOperationResponse = {
  status: 'success';
  message: string;
  file_path?: string;
};

// API Error Response
export type ApiError = {
  detail: string;
};
