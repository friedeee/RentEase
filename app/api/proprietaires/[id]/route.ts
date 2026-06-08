import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.proprietaire.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'Supprimé' })
}