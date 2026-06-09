import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const contrats = await prisma.contrat.findMany({
      include: {
        locataire: true,
        chambre: { include: { bien: true } },
        ReglementContrat: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(contrats)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { reglements, ...contratData } = body

    const contrat = await prisma.contrat.create({
    data: {
        ...contratData,
        dateDebut: new Date(contratData.dateDebut),
        dateFin: contratData.dateFin ? new Date(contratData.dateFin) : null,
        ReglementContrat: {
        create: reglements.map((texte: string) => ({ texte }))
        }
    }
    })
    await prisma.chambre.update({
      where: { id: contratData.chambreId },
      data: { statut: 'occupée' }
    })

    return NextResponse.json(contrat, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}