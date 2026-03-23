import { NextRequest, NextResponse } from 'next/server';
import { getHousingById } from '@/app/lib/data/housing';

// Retrieve a specific dorm's details using the ID from the URL
export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ housingId: string }> }
) {
  try {
    const { housingId } = await params;
    const data = await getHousingById(housingId);

    if (!data) {
      return NextResponse.json({ error: 'Housing record not found' }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}