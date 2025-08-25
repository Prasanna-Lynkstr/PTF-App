import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const extractTextFromResume = async (
  buffer: Buffer,
  filename: string
): Promise<string> => {
  const ext = path.extname(filename).toLowerCase();

  if (ext === '.pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (ext === '.docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else {
    throw new Error('Unsupported file format. Only PDF and DOCX are supported.');
  }
};

export { extractTextFromResume };