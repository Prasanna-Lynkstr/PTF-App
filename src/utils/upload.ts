export async function saveOrgImage(file: File, orgId: string, type: 'logo' | 'cover'): Promise<string> {
 

  const formData = new FormData();
  formData.append('file', file);

  const path = `${orgId}/${type}`; // Use org-specific folders

  const response = await fetch(`/api/upload/org-image?path=${path}&prefix=${type}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.url;
}