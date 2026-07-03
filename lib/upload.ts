export async function uploadFile(file: File, folder: string): Promise<string> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, contentType: file.type, folder }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Erro ao gerar URL de upload')
  const { presignedUrl, publicUrl } = data

  const uploadRes = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
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
