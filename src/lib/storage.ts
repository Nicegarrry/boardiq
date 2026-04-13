import { createClient } from './supabase'

const DOCUMENTS_BUCKET = 'documents'

export async function uploadDocument(
  file: File,
  orgId: string,
  agendaItemId: string
): Promise<{ path: string; error?: string }> {
  const supabase = createClient()
  const filePath = `${orgId}/${agendaItemId}/${Date.now()}_${file.name}`

  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) return { path: '', error: error.message }
  return { path: data.path }
}

export async function downloadDocument(path: string): Promise<{ url: string; error?: string }> {
  const supabase = createClient()
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(path, 3600) // 1 hour expiry

  if (error) return { url: '', error: error.message }
  return { url: data.signedUrl }
}

export async function deleteDocument(path: string): Promise<{ error?: string }> {
  const supabase = createClient()
  const { error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .remove([path])

  if (error) return { error: error.message }
  return {}
}

export function getDocumentPublicUrl(path: string): string {
  const supabase = createClient()
  const { data } = supabase.storage
    .from(DOCUMENTS_BUCKET)
    .getPublicUrl(path)
  return data.publicUrl
}
