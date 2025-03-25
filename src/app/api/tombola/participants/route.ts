import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/tombola/participants - Créer un nouveau participant
export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phoneNumber, qrCodeId } = await request.json();

    // Validation des champs obligatoires
    if (!firstName || !lastName || !email || !qrCodeId) {
      return NextResponse.json(
        { message: 'Les champs prénom, nom, email et ID du QR code sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si le QR code existe et n'a pas déjà été utilisé
    const qrCode = await prisma.qRCode.findUnique({
      where: {
        id: qrCodeId
      },
      include: {
        participant: true
      }
    });

    if (!qrCode) {
      return NextResponse.json(
        { message: 'QR code invalide' },
        { status: 400 }
      );
    }

    if (qrCode.isUsed || qrCode.participant) {
      return NextResponse.json(
        { message: 'Ce QR code a déjà été utilisé' },
        { status: 400 }
      );
    }

    // Créer le participant et mettre à jour le QR code
    const participant = await prisma.participant.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        qrCode: {
          connect: {
            id: qrCodeId
          }
        }
      }
    });

    // Marquer le QR code comme utilisé
    await prisma.qRCode.update({
      where: {
        id: qrCodeId
      },
      data: {
        isUsed: true,
        usedAt: new Date()
      }
    });

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du participant:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création du participant' },
      { status: 500 }
    );
  }
}

// GET /api/tombola/participants - Récupérer tous les participants
export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(participants);
  } catch (error) {
    console.error('Erreur lors de la récupération des participants:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des participants' },
      { status: 500 }
    );
  }
} 