import { NextRequest, NextResponse } from 'next/server';
import { readFile, unlink, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Chemin vers le répertoire de stockage des fichiers
const UPLOAD_DIR = process.env.NODE_ENV === 'production' 
  ? '/app/uploads' 
  : path.join(process.cwd(), 'uploads');

// Fonction pour trouver un fichier par son ID
async function findFileById(id: string) {
  if (!existsSync(UPLOAD_DIR)) {
    return null;
  }

  const files = await readdir(UPLOAD_DIR);
  const targetFile = files.find(filename => filename.startsWith(`${id}-`));
  
  if (!targetFile) {
    return null;
  }
  
  return {
    id,
    filename: targetFile,
    path: path.join(UPLOAD_DIR, targetFile)
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const fileInfo = await findFileById(id);
    
    if (!fileInfo) {
      return NextResponse.json(
        { message: 'Fichier non trouvé' },
        { status: 404 }
      );
    }
    
    const fileBuffer = await readFile(fileInfo.path);
    
    // Déterminer le type MIME basé sur l'extension du fichier
    const fileExtension = path.extname(fileInfo.filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.txt': 'text/plain',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
      '.zip': 'application/zip',
      '.json': 'application/json',
      '.csv': 'text/csv',
    };
    
    const contentType = mimeTypes[fileExtension] || 'application/octet-stream';
    
    // Extraire le nom original du fichier (sans l'ID)
    const originalFilename = fileInfo.filename.substring(id.length + 1);
    
    // Construire la réponse avec le contenu du fichier
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${originalFilename}"`,
      }
    });
    
    return response;
    
  } catch (error) {
    console.error('Erreur lors de la récupération du fichier:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du fichier' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const fileInfo = await findFileById(id);
    
    if (!fileInfo) {
      return NextResponse.json(
        { message: 'Fichier non trouvé' },
        { status: 404 }
      );
    }
    
    // Supprimer le fichier
    await unlink(fileInfo.path);
    
    // Ici, vous devriez également supprimer les métadonnées de votre base de données
    // Par exemple: await db.files.delete({ where: { id } });
    
    return NextResponse.json(
      { message: 'Fichier supprimé avec succès' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du fichier' },
      { status: 500 }
    );
  }
} 