import { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadToR2(file: Buffer, key: string, contentType: string): Promise<string> {
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  }))
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`
}

export async function getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(r2, command, { expiresIn: 600 })
}

function urlToKey(url: string): string | null {
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  if (!publicUrl || !url.startsWith(publicUrl)) return null
  return url.replace(publicUrl + '/', '')
}

export async function deleteFromR2(url: string): Promise<void> {
  const key = urlToKey(url)
  if (!key) return
  await r2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }))
}

export async function deleteManyFromR2(urls: string[]): Promise<void> {
  const keys = urls.map(urlToKey).filter((k): k is string => k !== null)
  if (keys.length === 0) return
  for (let i = 0; i < keys.length; i += 1000) {
    const batch = keys.slice(i, i + 1000)
    await r2.send(new DeleteObjectsCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Delete: { Objects: batch.map((Key) => ({ Key })) },
    }))
  }
}
