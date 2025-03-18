import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Génère un ID unique pour le fichier
const generateId = () => crypto.randomBytes(16).toString('hex');

// Chemin vers le répertoire de stockage des fichiers
const UPLOAD_DIR = process.env.NODE_ENV === 'production' 
  ? '/app/uploads' 
  : path.join(process.cwd(), 'uploads');

export async function POST(request: NextRequest) {
  try {
    // Vérifier si le répertoire d'upload existe, sinon le créer
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Récupérer le formData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier (limite de 100MB)
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: 'Le fichier est trop volumineux (maximum 100MB)' },
        { status: 400 }
      );
    }

    // Obtenir l'extension du fichier
    const originalFilename = file.name;
    const fileExtension = path.extname(originalFilename);
    
    // Générer un nom de fichier unique
    const fileId = generateId();
    const sanitizedFilename = originalFilename
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
    const uniqueFilename = `${fileId}-${sanitizedFilename}`;
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);
    
    // Enregistrer le fichier
    await writeFile(filePath, buffer);
    
    // Enregistrer les métadonnées du fichier dans une base de données
    // Pour cet exemple, nous allons simuler cela
    const fileData = {
      id: fileId,
      filename: originalFilename,
      size: file.size,
      path: filePath,
      uploadedAt: new Date().toISOString(),
      url: `/api/files/${fileId}`
    };
    
    // Ici, vous pouvez stocker fileData dans une base de données
    // Par exemple: await db.files.create({ data: fileData });
    
    return NextResponse.json(
      { 
        message: 'Fichier téléchargé avec succès',
        filename: originalFilename,
        id: fileId
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
    return NextResponse.json(
      { message: 'Erreur lors du téléchargement du fichier' },
      { status: 500 }
    );
  }
} 