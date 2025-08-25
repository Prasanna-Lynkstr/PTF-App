import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';
import * as pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';

GlobalWorkerOptions.workerSrc = pdfjsWorker;
import mammoth from 'mammoth';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export class ResumeTextExtractor {
  static async extract(file: File): Promise<string> {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.pdf')) {
      return this.extractFromPdf(file);
    } else if (fileName.endsWith('.docx')) {
      return this.extractFromDocx(file);
    } else if (fileName.endsWith('.txt')) {
      return await file.text();
    } else {
      throw new Error(`Unsupported file type: ${fileName}`);
    }
  }

  private static async extractFromPdf(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      text += strings.join(' ') + '\n';
    }

    console.log("Resume text: ", text);
    return text.trim();
  }

  private static async extractFromDocx(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value.trim();
  }
}