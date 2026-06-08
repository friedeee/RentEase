import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const chambres = await prisma.chambre.findMany({
    include: { bien: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(chambres)
}

export async function POST(request: Request) {
  const body = await request.json()
  const chambre = await prisma.chambre.create({ data: body })
  return NextResponse.json(chambre, { status: 201 })
}