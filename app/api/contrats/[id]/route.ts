import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const contrat = await prisma.contrat.findUnique({
    where: { id: params.id },
    include: {
      locataire: true,
      chambre: {
        include: {
          bien: {
            include: { proprietaire: true }
          }
        }
      },
      reglements: true
    }
  })
  return NextResponse.json(contrat)
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const contrat = await prisma.contrat.update({
    where: { id: params.id },
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