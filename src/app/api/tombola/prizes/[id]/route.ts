import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/tombola/prizes/[id] - Récupérer un lot spécifique
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: 'L\'ID du lot est requis' },
        { status: 400 }
      );
    }

    const prize = await prisma.prize.findUnique({
      where: {
        id
      }
    });

    if (!prize) {
      return NextResponse.json(
        { message: 'Lot non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(prize);
  } catch (error) {
    console.error('Erreur lors de la récupération du lot:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du lot' },
      { status: 500 }
    );
  }
}

// PUT /api/tombola/prizes/[id] - Mettre à jour un lot
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const { name, description, quantity } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'L\'ID du lot est requis' },
        { status: 400 }
      );
    }

    // Validation des champs obligatoires
    if (!name) {
      return NextResponse.json(
        { message: 'Le nom du lot est requis' },
        { status: 400 }
      );
    }

    // Vérifier si le lot existe
    const existingPrize = await prisma.prize.findUnique({
      where: {
        id
      }
    });

    if (!existingPrize) {
      return NextResponse.json(
        { message: 'Lot non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le lot
    const updatedPrize = await prisma.prize.update({
      where: {
        id
      },
      data: {
        name,
        description,
        quantity: quantity || 1
      }
    });

    return NextResponse.json(updatedPrize);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du lot:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du lot' },
      { status: 500 }
    );
  }
}

// DELETE /api/tombola/prizes/[id] - Supprimer un lot
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: 'L\'ID du lot est requis' },
        { status: 400 }
      );
    }

    // Vérifier si le lot existe
    const existingPrize = await prisma.prize.findUnique({
      where: {
        id
      }
    });

    if (!existingPrize) {
      return NextResponse.json(
        { message: 'Lot non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le lot
    await prisma.prize.delete({
      where: {
        id
      }
    });

    return NextResponse.json({ message: 'Lot supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du lot:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du lot' },
      { status: 500 }
    );
  }
} 