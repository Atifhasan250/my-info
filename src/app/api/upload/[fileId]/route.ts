import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function DELETE(
  req: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    await imagekit.deleteFile(params.fileId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('ImageKit delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
