import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const locataires = await prisma.locataire.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(locataires)
}

export async function POST(request: Request) {
  const body = await request.json()
  const locataire = await prisma.locataire.create({ data: body })
  return NextResponse.json(locataire, { status: 201 })
}