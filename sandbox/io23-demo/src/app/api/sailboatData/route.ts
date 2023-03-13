import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';

// TODO: since this is just forwarding a json file, we could serve it statically
// However, this way we may wish to filter it server-side, using Request parameters.
export async function GET(request: Request) {
  console.log('Saildata requested');

  const jsonDirectory = path.join(process.cwd(), 'src', 'data');
  const contents = await fs.readFile(jsonDirectory + '/all_sailboats.json', 'utf8');
  const data = JSON.parse(contents);

  // Response.json() would work but TS complains, boo
  return NextResponse.json(data);
}