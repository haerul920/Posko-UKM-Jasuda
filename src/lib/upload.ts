/**
 * Uploads a file locally via /api/upload endpoint.
 *
 * @param file The file object to upload
 * @param folder The target folder (e.g. 'clients' or 'products')
 * @param onProgress Optional progress callback
 * @returns Promise resolving to the public URL of the uploaded file
 */
export const uploadFileToStorage = async (
  file: File,
  folder: string,
  onProgress?: (progress: number) => void,
): Promise<string> => {
  if (onProgress) onProgress(30);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (onProgress) onProgress(80);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal mengunggah gambar");
  }

  const data = await response.json();
  if (onProgress) onProgress(100);

  return data.url;
};
