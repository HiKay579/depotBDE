import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/tombola/winners - Créer un nouveau gagnant
export async function POST(request: NextRequest) {
  try {
    const { participantId, prizeId } = await request.json();

    // Validation des champs obligatoires
    if (!participantId || !prizeId) {
      return NextResponse.json(
        { message: 'L\'ID du participant et l\'ID du lot sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si le participant existe
    const participant = await prisma.participant.findUnique({
      where: {
        id: participantId
      }
    });

    if (!participant) {
      return NextResponse.json(
        { message: 'Participant non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le lot existe
    const prize = await prisma.prize.findUnique({
      where: {
        id: prizeId
      }
    });

    if (!prize) {
      return NextResponse.json(
        { message: 'Lot non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le participant a déjà gagné
    const existingWinner = await prisma.winner.findFirst({
      where: {
        participantId
      }
    });

    if (existingWinner) {
      return NextResponse.json(
        { message: 'Ce participant a déjà gagné un lot' },
        { status: 400 }
      );
    }

    // Créer le gagnant
    const winner = await prisma.winner.create({
      data: {
        participantId,
        prizeId
      }
    });

    return NextResponse.json(winner, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du gagnant:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création du gagnant' },
      { status: 500 }
    );
  }
}

// GET /api/tombola/winners - Récupérer tous les gagnants
export async function GET() {
  try {
    const winners = await prisma.winner.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        prize: true,
        participant: true
      }
    });

    return NextResponse.json(winners);
  } catch (error) {
    console.error('Erreur lors de la récupération des gagnants:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des gagnants' },
      { status: 500 }
    );
  }
} 