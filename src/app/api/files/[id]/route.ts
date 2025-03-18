import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat, readFile } from 'fs/promises';
import { existsSync, createReadStream } from 'fs';
import path from 'path';

// Chemin vers le répertoire de stockage des fichiers
const UPLOAD_DIR = process.env.NODE_ENV === 'production' 
  ? '/app/uploads' 
  : path.join(process.cwd(), 'uploads');

// Fonction pour trouver un fichier par son ID
async function findFileById(id: string) {
  try {
    if (!existsSync(UPLOAD_DIR)) {
      console.log('Le répertoire des uploads n\'existe pas:', UPLOAD_DIR);
      return null;
    }

    const files = await readdir(UPLOAD_DIR);
    console.log('Fichiers disponibles:', files);
    
    const targetFile = files.find(filename => filename.startsWith(`${id}-`));
    
    console.log('Recherche de fichier commençant par:', `${id}-`);
    console.log('Fichier trouvé:', targetFile);
    
    if (!targetFile) {
      return null;
    }
    
    return {
      id,
      filename: targetFile,
      path: path.join(UPLOAD_DIR, targetFile)
    };
  } catch (error) {
    console.error('Erreur dans findFileById:', error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('ID demandé:', id);
    
    const fileInfo = await findFileById(id);
    console.log('Informations du fichier:', fileInfo);
    
    if (!fileInfo) {
      return NextResponse.json(
        { message: 'Fichier non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier que le fichier existe
    if (!existsSync(fileInfo.path)) {
      console.log('Le chemin du fichier n\'existe pas:', fileInfo.path);
      return NextResponse.json(
        { message: 'Fichier introuvable sur le disque' },
        { status: 404 }
      );
    }
    
    // Obtenir les stats du fichier (taille)
    const fileStats = await stat(fileInfo.path);
    
    // Essayer de détecter le type MIME à partir du nom original
    const originalFilename = fileInfo.filename.substring(id.length + 1);
    console.log('Nom original:', originalFilename);
    
    // Amélioration de la détection du type MIME
    let contentType = 'application/octet-stream';
    if (originalFilename.toLowerCase().includes('pdf')) {
      contentType = 'application/pdf';
    } else if (originalFilename.toLowerCase().includes('doc')) {
      contentType = 'application/msword';
    } else if (originalFilename.toLowerCase().includes('jpg') || originalFilename.toLowerCase().includes('jpeg')) {
      contentType = 'image/jpeg';
    } else if (originalFilename.toLowerCase().includes('png')) {
      contentType = 'image/png';
    } else if (originalFilename.toLowerCase().includes('zip')) {
      contentType = 'application/zip';
    }
    
    // Pour le débogage - Forcer temporairement le type PDF
    if (originalFilename.includes('cours_progweb_2_jquery_pdf')) {
      contentType = 'application/pdf';
    }
    
    console.log('Type de contenu détecté:', contentType);
    
    // Construire le nom de fichier pour le téléchargement
    let downloadFilename = originalFilename;
    
    // Ajouter l'extension si elle n'existe pas
    if (contentType === 'application/pdf' && !downloadFilename.endsWith('.pdf')) {
      downloadFilename += '.pdf';
    } else if (contentType === 'application/msword' && !downloadFilename.endsWith('.doc')) {
      downloadFilename += '.doc';
    } else if (contentType === 'image/jpeg' && !downloadFilename.endsWith('.jpg') && !downloadFilename.endsWith('.jpeg')) {
      downloadFilename += '.jpg';
    }
    
    console.log('Nom de fichier pour téléchargement:', downloadFilename);
    
    // Approche simplifiée : lire le fichier et l'envoyer
    // Pour les fichiers volumineux, nous limitons la taille
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    
    // Si le fichier est trop volumineux, utilisez une méthode alternative
    if (fileStats.size > MAX_SIZE) {
      console.log('Fichier trop volumineux, utilisation d\'une réponse simplifiée');
      
      // Renvoyer une réponse simplifiée qui invite au téléchargement
      return new Response(`Le fichier est trop volumineux pour être diffusé directement. 
      Veuillez utiliser le bouton de téléchargement.`, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': 'inline'
        }
      });
    }
    
    // Lire le fichier en mémoire pour les fichiers de taille raisonnable
    const fileBuffer = await readFile(fileInfo.path);
    
    // Utiliser l'API Response native
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
        'Content-Length': fileStats.size.toString(),
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
      }
    });
    
  } catch (error) {
    console.error('Erreur complète lors de la récupération du fichier:', error);
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
    await import('fs/promises').then(fs => fs.unlink(fileInfo.path));
    
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