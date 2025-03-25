import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/tombola/qrcodes/[id] - Récupérer un QR code spécifique
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: 'L\'ID du QR code est requis' },
        { status: 400 }
      );
    }

    const qrCode = await prisma.qRCode.findUnique({
      where: {
        id
      },
      include: {
        participant: true
      }
    });

    if (!qrCode) {
      return NextResponse.json(
        { message: 'QR code non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(qrCode);
  } catch (error) {
    console.error('Erreur lors de la récupération du QR code:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du QR code' },
      { status: 500 }
    );
  }
}

// DELETE /api/tombola/qrcodes/[id] - Supprimer un QR code
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: 'L\'ID du QR code est requis' },
        { status: 400 }
      );
    }

    // Vérifier si le QR code existe
    const existingQRCode = await prisma.qRCode.findUnique({
      where: {
        id
      }
    });

    if (!existingQRCode) {
      return NextResponse.json(
        { message: 'QR code non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le QR code
    await prisma.qRCode.delete({
      where: {
        id
      }
    });

    return NextResponse.json({ message: 'QR code supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du QR code:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du QR code' },
      { status: 500 }
    );
  }
} 