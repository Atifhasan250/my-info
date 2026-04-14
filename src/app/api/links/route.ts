import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CustomLink } from '@/lib/models/CustomLink';

export async function GET() {
  try {
    await connectToDatabase();
    const links = await CustomLink.find().sort({ order: 1 }).lean();
    return NextResponse.json(links);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}
