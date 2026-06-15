import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const paiement = await prisma.paiement.findUnique({
    where: { id },
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