import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./client";

/**
 * Uploads a file to Firebase Storage under the specified folder.
 * This runs entirely on the client-side.
 *
 * @param file The file object to upload
 * @param folder The folder path in the storage bucket (e.g. 'clients' or 'products')
 * @param onProgress Optional callback to receive upload progress percentage (0-100)
 * @returns Promise that resolves to the download URL of the uploaded file
 */
export const uploadFileToStorage = async (
    file: File,
    folder: string,
    onProgress?: (progress: number) => void,
): Promise<string> => {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);
    console.log(uploadTask);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) onProgress(progress);
            },
            (error) => {
                reject(error);
            },
            async () => {
                const downloadURL = await getDownloadURL(
                    uploadTask.snapshot.ref,
                );
                resolve(downloadURL);
            },
        );
    });
};
