import fs from 'fs';
import path from 'path';

const formsDir = path.resolve('formularios');

if (!fs.existsSync(formsDir)) {
  fs.mkdirSync(formsDir);
}

export function saveResponsesToFile(jobTitle, responses) {
  const filePath = path.resolve(formsDir, `${sanitizeFileName(jobTitle)}.json`);
  fs.writeFileSync(filePath, JSON.stringify(responses, null, 2));
}

export function loadResponsesFromFile(jobTitle) {
  const filePath = path.resolve(formsDir, `${sanitizeFileName(jobTitle)}.json`);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }
  return null;
}

function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}
