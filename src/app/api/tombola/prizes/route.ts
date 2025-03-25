import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/tombola/prizes - Créer un nouveau lot
export async function POST(request: NextRequest) {
  try {
    const { name, description, quantity } = await request.json();

    // Validation des champs obligatoires
    if (!name) {
      return NextResponse.json(
        { message: 'Le nom du lot est requis' },
        { status: 400 }
      );
    }

    const prize = await prisma.prize.create({
      data: {
        name,
        description,
        quantity: quantity || 1
      }
    });

    return NextResponse.json(prize, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du lot:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création du lot' },
      { status: 500 }
    );
  }
}

// GET /api/tombola/prizes - Récupérer tous les lots
export async function GET() {
  try {
    const prizes = await prisma.prize.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        quantity: {
          gt: 0
        }
      }
    });

    return NextResponse.json(prizes);
  } catch (error) {
    console.error('Erreur lors de la récupération des lots:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des lots' },
      { status: 500 }
    );
  }
} 