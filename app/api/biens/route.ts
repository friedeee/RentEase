import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const biens = await prisma.bien.findMany({
    include: { proprietaire: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(biens)
}

export async function POST(request: Request) {
  const body = await request.json()
  const bien = await prisma.bien.create({ data: body })
  return NextResponse.json(bien, { status: 201 })
}