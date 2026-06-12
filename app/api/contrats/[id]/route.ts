import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const contrat = await prisma.contrat.findUnique({
    where: { id },
    include: {
      locataire: true,
      chambre: {
        include: {
          bien: {
            include: { proprietaire: true }
          }
        }
      },
      ReglementContrat: true
    }
  })
  return NextResponse.json(contrat)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const contrat = await prisma.contrat.update({
    where: { id },
    data: body,
    include: { chambre: true }
  })

  if (body.statut === 'résilié') {
    await prisma.chambre.update({
      where: { id: contrat.chambreId },
      data: { statut: 'libre' }
    })
  }

  return NextResponse.json(contrat)
}