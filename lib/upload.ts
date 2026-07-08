const MAX_DIMENSION = 2000
const JPEG_QUALITY = 0.82
const SKIP_COMPRESSION_UNDER_BYTES = 400 * 1024

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file
  if (file.size < SKIP_COMPRESSION_UNDER_BYTES) return file

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      let { width, height } = img
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width)
          width = MAX_DIMENSION
        } else {
          width = Math.round((width * MAX_DIMENSION) / height)
          height = MAX_DIMENSION
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(objectUrl)
        resolve(file)
        return
      }
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objectUrl)
        if (!blob || blob.size >= file.size) {
          resolve(file)
          return
        }
        const compressedFile = new File(
          [blob],
          file.name.replace(/\.\w+$/, '.jpg'),
          { type: 'image/jpeg' },
        )
        resolve(compressedFile)
      }, 'image/jpeg', JPEG_QUALITY)
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file)
    }

    img.src = objectUrl
  })
}

export async function uploadFile(file: File, folder: string): Promise<string> {
  const processedFile = await compressImage(file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: processedFile.name, contentType: processedFile.type, folder }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Erro ao gerar URL de upload')
  const { presignedUrl, publicUrl } = data

  const uploadRes = await fetch(presignedUrl, {
    method: 'PUT',
    body: processedFile,
    headers: { 'Content-Type': processedFile.type },
  })
  if (!uploadRes.ok) throw new Error('Erro ao enviar arquivo')

  return publicUrl
}

export async function deleteFiles(urls: string[]): Promise<void> {
  if (urls.length === 0) return
  await fetch('/api/delete-files', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls }),
  })
}

export async function uploadFiles(
  files: File[],
  folder: string,
  onProgress?: (done: number, total: number) => void,
  concurrency = 5,
): Promise<string[]> {
  const results: string[] = new Array(files.length)
  let done = 0

  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency)
    const urls = await Promise.all(batch.map((f) => uploadFile(f, folder)))
    urls.forEach((url, j) => { results[i + j] = url })
    done += batch.length
    onProgress?.(done, files.length)
  }

  return results
}
