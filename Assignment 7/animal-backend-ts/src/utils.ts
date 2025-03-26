import fs from 'fs/promises';
import { Animal, User } from './interfaces';

export async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error reading file ${filePath}: ${error.message}`);
    }
    throw new Error(`Error reading file ${filePath}: Unknown error occurred`);
  }
}

export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error writing file ${filePath}: ${error.message}`);
    }
    throw new Error(`Error writing file ${filePath}: Unknown error occurred`);
  }
}

export function isValidDate(dateString: string): boolean {
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  return regex.test(dateString);
}

export function generateUniqueId(animals: Animal[]): number {
  if (animals.length === 0) return 1;
  const maxId = Math.max(...animals.map(a => a.id));
  return maxId + 1;
}