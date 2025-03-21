import fs from 'fs/promises';

export async function readJsonFile(filePath: string): Promise<any> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error reading file ${filePath}: ${error.message}`);
    } else {
      throw new Error(`Error reading file ${filePath}: Unknown error occurred`);
    }
  }
}

export async function writeJsonFile(filePath: string, data: any): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error writing file ${filePath}: ${error.message}`);
    } else {
      throw new Error(`Error writing file ${filePath}: Unknown error occurred`);
    }
  }
}