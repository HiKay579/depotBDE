import { PrismaClient } from '@prisma/client'

// PrismaClient est attaché au scope global dans les environnements de développement
// pour éviter de consommer trop de connexions à la base de données
declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma 