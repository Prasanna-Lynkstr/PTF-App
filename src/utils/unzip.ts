// src/utils/unzip.ts
import JSZip from "jszip";

export async function extractResumesFromZip(file: File): Promise<File[]> {
  const zip = await JSZip.loadAsync(file);
  const extractedFiles: File[] = [];

  const resumeExtensions = [".pdf", ".docx"];
  const seen = new Set<string>();

  const entries = Object.values(zip.files).filter(entry =>
    !entry.dir &&
    resumeExtensions.some(ext => entry.name.toLowerCase().endsWith(ext)) &&
    !entry.name.startsWith("__MACOSX")
  );

  for (const entry of entries.slice(0, 10)) {
    if (seen.has(entry.name)) continue;
    seen.add(entry.name);

    const content = await entry.async("blob");
    const extractedFile = new File([content], entry.name, { type: content.type });
    extractedFiles.push(extractedFile);
  }

  return extractedFiles;
}