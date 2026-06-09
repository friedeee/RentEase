import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const paiement = await prisma.paiement.findUnique({
    where: { id: params.id },
    include: {
      contrat: {
        include: {
          locataire: true,
          chambre: {
            include: {
              bien: {
                include: { proprietaire: true }
              }
            }
          }
        }
      }
    }
  })
  return NextResponse.json(paiement)
}