'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Contrat = {
  id: string
  dateDebut: string
  dateFin: string | null
  loyer: number
  caution: number
  statut: string
  locataire: {
    nom: string
    prenom: string
    telephone: string
    email: string
    cni: string
    profession: string
  }
  chambre: {
    numero: string
    superficie: number
    bien: {
      nom: string
      adresse: string
      proprietaire: {
        nom: string
        prenom: string
        telephone: string
        email: string
        adresse: string
      }
    }
  }
  ReglementContrat: { id: string; texte: string }[]
}

export default function ContratPDFPage() {
  const { id } = useParams()
  const [contrat, setContrat] = useState<Contrat | null>(null)

  useEffect(() => {
    fetch(`/api/contrats/${id}`)
      .then(res => res.json())
      .then(data => setContrat(data))
  }, [id])

  if (!contrat) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-slate-500">Chargement...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-100 py-8 w-full flex flex-col items-center">
      {/* Boutons */}
      <div className="w-full max-w-3xl mb-4 flex justify-end gap-2 px-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          🖨️ Imprimer / Télécharger PDF
        </button>
        <button
          onClick={() => window.history.back()}
          className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300"
        >
          ← Retour
        </button>
      </div>

      {/* Contrat */}
      <div className="w-full max-w-3xl bg-white shadow-lg p-12 print:shadow-none print:p-8">

        {/* En-tête */}
        <div className="text-center mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold text-blue-600">RentEase</h1>
          <p className="text-slate-500 text-sm mt-1">Gestion de locations immobilières</p>
          <h2 className="text-xl font-bold text-slate-800 mt-4 uppercase">
            Contrat de bail
          </h2>
          <p className="text-slate-500 text-sm">
            N° {contrat.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="border border-slate-200 rounded-lg p-4 text-justify">
            <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">
              Le Bailleur
            </h3>
            <p className="text-slate-700">
              <span className="font-medium">Nom :</span>{' '}
              {contrat.chambre.bien.proprietaire.nom}{' '}
              {contrat.chambre.bien.proprietaire.prenom}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Téléphone :</span>{' '}
              {contrat.chambre.bien.proprietaire.telephone}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Email :</span>{' '}
              {contrat.chambre.bien.proprietaire.email}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Adresse :</span>{' '}
              {contrat.chambre.bien.proprietaire.adresse}
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 text-justify">
            <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">
              Le Locataire
            </h3>
            <p className="text-slate-700">
              <span className="font-medium">Nom :</span>{' '}
              {contrat.locataire.nom} {contrat.locataire.prenom}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Téléphone :</span>{' '}
              {contrat.locataire.telephone}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Email :</span>{' '}
              {contrat.locataire.email}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">CNI :</span>{' '}
              {contrat.locataire.cni}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Profession :</span>{' '}
              {contrat.locataire.profession}
            </p>
          </div>
        </div>

        {/* Bien loué */}
        <div className="border border-slate-200 rounded-lg p-4 mb-6 text-justify">
          <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">
            Le bien loué
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-slate-700">
              <span className="font-medium">Bien :</span>{' '}
              {contrat.chambre.bien.nom}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Adresse :</span>{' '}
              {contrat.chambre.bien.adresse}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Chambre N° :</span>{' '}
              {contrat.chambre.numero}
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Superficie :</span>{' '}
              {contrat.chambre.superficie} m²
            </p>
          </div>
        </div>

        {/* Conditions financières */}
        <div className="border border-slate-200 rounded-lg p-4 mb-6 text-justify">
          <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">
            Conditions financières
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-slate-700">
              <span className="font-medium">Loyer mensuel :</span>{' '}
              <span className="text-blue-600 font-bold">
                {contrat.loyer.toLocaleString()} FCFA
              </span>
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Caution :</span>{' '}
              <span className="text-blue-600 font-bold">
                {contrat.caution.toLocaleString()} FCFA
              </span>
            </p>
            <p className="text-slate-700">
              <span className="font-medium">Date de début :</span>{' '}
              {new Date(contrat.dateDebut).toLocaleDateString('fr-FR')}
            </p>
            {contrat.dateFin && (
              <p className="text-slate-700">
                <span className="font-medium">Date de fin :</span>{' '}
                {new Date(contrat.dateFin).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>

        {/* Règlements */}
        <div className="border border-slate-200 rounded-lg p-4 mb-8 text-justify">
          <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">
            Règlements et obligations
          </h3>
          <ul className="space-y-2">
            {contrat.ReglementContrat.map((r, i) => (
              <li key={r.id} className="flex items-start gap-2 text-slate-700">
                <span className="text-blue-600 font-bold">{i + 1}.</span>
                <span className="text-justify">{r.texte}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-12">
          <div className="text-center">
            <div className="border-t border-slate-400 pt-2 mt-16">
              <p className="text-slate-600 text-sm">Signature du Bailleur</p>
              <p className="text-slate-800 font-medium mt-1">
                {contrat.chambre.bien.proprietaire.nom}{' '}
                {contrat.chambre.bien.proprietaire.prenom}
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-400 pt-2 mt-16">
              <p className="text-slate-600 text-sm">Signature du Locataire</p>
              <p className="text-slate-800 font-medium mt-1">
                {contrat.locataire.nom} {contrat.locataire.prenom}
              </p>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          Fait à Cotonou, le {new Date().toLocaleDateString('fr-FR')}
        </div>

      </div>
    </div>
  )
}