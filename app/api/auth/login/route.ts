import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log('Email reçu:', email)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    console.log('User trouvé:', user)

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, user.password)

    console.log('Mot de passe valide:', isValid)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: 'Connexion réussie', user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}