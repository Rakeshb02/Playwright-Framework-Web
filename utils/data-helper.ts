import fs from 'fs';
import path from 'path';

export class DataHelper {
  /**
   * Read any JSON file from test-data directory
   */
  static readJson<T>(relativePath: string): T {
    const fullPath = path.resolve(__dirname, '../test-data', relativePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(content) as T;
  }

  /**
   * Generate a unique email with timestamp to avoid duplicate registration conflicts
   */
  static generateRandomEmail(prefix = 'autouser'): string {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${prefix}_${timestamp}_${randomSuffix}@test.com`;
  }
}
