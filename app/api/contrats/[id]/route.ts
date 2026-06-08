import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

  // Libérer la chambre si résilié
  if (body.statut === 'résilié') {
    await prisma.chambre.update({
      where: { id: contrat.chambreId },
      data: { statut: 'libre' }
    })
  }

  return NextResponse.json(contrat)
}