import { NextRequest, NextResponse } from 'next/server';
import { getHousingById } from '@/app/lib/data/housing';

// Retrieve a specific dorm's details using the ID from the URL
export async function GET(
  req: NextRequest, 
  { params }: { params: { housingId: string } }
) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { housingId } = params;
    const data = await getHousingById(housingId);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Housing record not found' }, { status: 404 });
  }
}