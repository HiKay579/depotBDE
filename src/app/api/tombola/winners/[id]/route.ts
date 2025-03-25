import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/tombola/winners/[id] - Récupérer un gagnant spécifique
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: 'L\'ID du gagnant est requis' },
        { status: 400 }
      );
    }

    const winner = await prisma.winner.findUnique({
      where: {
        id
      },
      include: {
        prize: true
      }
    });

    if (!winner) {
      return NextResponse.json(
        { message: 'Gagnant non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(winner);
  } catch (error) {
    console.error('Erreur lors de la récupération du gagnant:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du gagnant' },
      { status: 500 }
    );
  }
}

// DELETE /api/tombola/winners/[id] - Annuler un tirage au sort
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: 'L\'ID du gagnant est requis' },
        { status: 400 }
      );
    }

    // Vérifier si le gagnant existe
    const existingWinner = await prisma.winner.findUnique({
      where: {
        id
      }
    });

    if (!existingWinner) {
      return NextResponse.json(
        { message: 'Gagnant non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le gagnant
    await prisma.winner.delete({
      where: {
        id
      }
    });

    return NextResponse.json({ message: 'Tirage au sort annulé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'annulation du tirage au sort:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'annulation du tirage au sort' },
      { status: 500 }
    );
  }
} 