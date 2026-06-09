import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const paiements = await prisma.paiement.findMany({
    include: {
      contrat: {
        include: {
          locataire: true,
          chambre: { include: { bien: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(paiements)
}

export async function POST(request: Request) {
  const body = await request.json()
  const paiement = await prisma.paiement.create({ data: body })
  return NextResponse.json(paiement, { status: 201 })
}