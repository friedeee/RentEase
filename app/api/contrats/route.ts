import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const contrats = await prisma.contrat.findMany({
    include: {
      locataire: true,
      chambre: { include: { bien: true } },
      reglements: true
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(contrats)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { reglements, ...contratData } = body

  const contrat = await prisma.contrat.create({
    data: {
      ...contratData,
      reglements: {
        create: reglements.map((texte: string) => ({ texte }))
      }
    }
  })

  await prisma.chambre.update({
    where: { id: contratData.chambreId },
    data: { statut: 'occupée' }
  })

  return NextResponse.json(contrat, { status: 201 })
}