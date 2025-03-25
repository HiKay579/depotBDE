import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/tombola/qrcodes - Créer un nouveau QR code
export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'L\'ID du QR code est requis' },
        { status: 400 }
      );
    }

    const qrCode = await prisma.qRCode.create({
      data: {
        id
      }
    });

    return NextResponse.json(qrCode, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du QR code:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création du QR code' },
      { status: 500 }
    );
  }
}

// GET /api/tombola/qrcodes - Récupérer tous les QR codes
export async function GET() {
  try {
    const qrCodes = await prisma.qRCode.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        participant: true
      }
    });

    return NextResponse.json(qrCodes);
  } catch (error) {
    console.error('Erreur lors de la récupération des QR codes:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des QR codes' },
      { status: 500 }
    );
  }
} 