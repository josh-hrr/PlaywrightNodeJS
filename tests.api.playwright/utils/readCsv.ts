// readCsvExample.ts
import fs from 'node:fs/promises';
import { parse } from 'csv-parse/sync';

type CsvRow = {
  name: string;
  email: string;
  age: number; 
};

export async function readCsv(filePath: string): Promise<CsvRow[]> {
  const fileContent = await fs.readFile(filePath, 'utf-8');

  const records = parse(fileContent, {
    columns: true, // first row = header names
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  return records;
}

// Quick local run
const rows = await readCsv(
  './tests.api.playwright/TestData/create_user.csv',
);

for (const row of rows) {
  console.log('\nTestData: ');
  console.log(row.name);
  console.log(row.email);
  console.log(row.age); 
}
