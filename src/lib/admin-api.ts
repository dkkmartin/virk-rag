// Common Types
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

export type FileOperationResponse = {
  status: 'success';
  message: string;
  file_path?: string;
};

// API Error Response
export type ApiError = {
  detail: string;
};

// API Class
export class AdminApi {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private get headers() {
    return {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  // List Files
  async listFiles(params?: PaginationParams): Promise<ListFilesResponse> {
    const queryParams = new URLSearchParams({
      skip: (params?.skip ?? 0).toString(),
      limit: (params?.limit ?? 100).toString(),
      sort_by: params?.sort_by ?? 'last_modified',
      order: params?.order ?? 'desc',
    });

    const response = await fetch(`${this.baseUrl}/admin/files?${queryParams}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw (await response.json()) as ApiError;
    }

    return response.json();
  }

  // Get File Details
  async getFileDetails(cvrNumber: string): Promise<FileDetailsResponse> {
    const response = await fetch(`${this.baseUrl}/admin/files/${cvrNumber}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw (await response.json()) as ApiError;
    }

    return response.json();
  }

  // Create File
  async createFile(cvrNumber: string, data: unknown): Promise<FileOperationResponse> {
    const response = await fetch(`${this.baseUrl}/admin/files/${cvrNumber}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw (await response.json()) as ApiError;
    }

    return response.json();
  }

  // Update File
  async updateFile(cvrNumber: string, data: unknown): Promise<FileOperationResponse> {
    const response = await fetch(`${this.baseUrl}/admin/files/${cvrNumber}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw (await response.json()) as ApiError;
    }

    return response.json();
  }

  // Delete File
  async deleteFile(cvrNumber: string): Promise<FileOperationResponse> {
    const response = await fetch(`${this.baseUrl}/admin/files/${cvrNumber}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    if (!response.ok) {
      throw (await response.json()) as ApiError;
    }

    return response.json();
  }

  // Get Statistics
  async getStatistics(forceRefresh = false): Promise<Statistics> {
    const queryParams = new URLSearchParams({
      force_refresh: forceRefresh.toString(),
    });

    const response = await fetch(`${this.baseUrl}/admin/statistics?${queryParams}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw (await response.json()) as ApiError;
    }

    return response.json();
  }

  // Get System Information
  async getSystemInfo(): Promise<SystemInfo> {
    const response = await fetch(`${this.baseUrl}/admin/system`, { headers: this.headers });

    if (!response.ok) {
      throw (await response.json()) as ApiError;
    }

    return response.json();
  }
}
