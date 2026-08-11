import { NetworkService } from "./network.service.ts";
import { fileDownloadService } from "./fileDownload.service.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";

export interface FileMeta {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  checksum: string;
  createdAt: string;
  deleted: boolean;
}

export class ShareService extends NetworkService {
  constructor() {
    super("/share");
  }

  public async getFiles(): Promise<FileMeta[]> {
    return this.get<FileMeta[]>("");
  }

  public async uploadFiles(files: File[]): Promise<void> {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    await this.post<void, FormData>("", formData);
  }

  public async deleteFile(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }

  public async downloadFile(file: FileMeta): Promise<void> {
    await fileDownloadService.downloadSharedFile(file.id, file.filename);
    ToastManager.toastGood(`File "${file.filename}" downloaded.`);
  }
}

export const shareService = new ShareService();
