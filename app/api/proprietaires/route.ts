import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const proprietaires = await prisma.proprietaire.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(proprietaires)
}

export async function POST(request: Request) {
  const body = await request.json()
  const proprietaire = await prisma.proprietaire.create({ data: body })
  return NextResponse.json(proprietaire, { status: 201 })
}