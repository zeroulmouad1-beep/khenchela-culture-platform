import { storage, isConfigured } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const isMockStorage = !isConfigured || !storage

export async function uploadImage(file: File, path: string): Promise<string> {
  if (isMockStorage) {
    return URL.createObjectURL(file)
  }

  const storageRef = ref(storage!, `${path}/${Date.now()}-${file.name}`)
  const snapshot = await uploadBytes(storageRef, file)
  return getDownloadURL(snapshot.ref)
}

export async function uploadMultipleImages(files: File[], path: string): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    const url = await uploadImage(file, path)
    urls.push(url)
  }
  return urls
}
