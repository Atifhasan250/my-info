import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Social } from '@/lib/models/Social';

export async function GET() {
  try {
    await connectToDatabase();
    const socials = await Social.find().sort({ order: 1 }).lean();
    return NextResponse.json(socials);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch socials' }, { status: 500 });
  }
}
