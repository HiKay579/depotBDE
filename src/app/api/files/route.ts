import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Chemin vers le répertoire de stockage des fichiers
const UPLOAD_DIR = process.env.NODE_ENV === 'production' 
  ? '/app/uploads' 
  : path.join(process.cwd(), 'uploads');

// Dans une application réelle, vous utiliseriez une base de données
// Cette fonction simule la récupération des métadonnées des fichiers
async function getFilesFromDirectory() {
  if (!existsSync(UPLOAD_DIR)) {
    return [];
  }

  const files = await readdir(UPLOAD_DIR);
  const fileObjects = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(UPLOAD_DIR, filename);
      const fileStat = await stat(filePath);
      
      // Extraire l'ID du nom de fichier (notre convention: ID-nom_fichier)
      const fileId = filename.split('-')[0];
      
      // Extraire le nom original du fichier (enlever l'ID et restaurer l'extension)
      const originalFilename = filename.substring(fileId.length + 1);
      
      return {
        id: fileId,
        filename: originalFilename,
        size: fileStat.size,
        uploadedAt: fileStat.birthtime.toISOString(),
        url: `/api/files/${fileId}`
      };
    })
  );

  return fileObjects;
}

export async function GET(request: NextRequest) {
  try {
    const files = await getFilesFromDirectory();
    
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des fichiers' },
      { status: 500 }
    );
  }
} 