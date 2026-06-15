'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Paiement = {
  id: string
  montant: number
  datePaiement: string
  moisConcerne: string
  statut: string
  contrat: {
    loyer: number
    caution: number
    locataire: {
      nom: string
      prenom: string
      telephone: string
      email: string
    }
    chambre: {
      numero: string
      bien: {
        nom: string
        adresse: string
        proprietaire: {
          nom: string
          prenom: string
          telephone: string
          email: string
        }
      }
    }
  }
}

export default function RecuPage() {
  const { id } = useParams()
  const [paiement, setPaiement] = useState<Paiement | null>(null)

  useEffect(() => {
    fetch(`/api/paiements/${id}`)
      .then(res => res.json())
      .then(data => setPaiement(data))
  }, [id])

  if (!paiement) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-slate-500">Chargement...</p>
    </div>
  )

  const numeroRecu = `REC-${paiement.id.slice(0, 8).toUpperCase()}`

  return (
    <div className="min-h-screen bg-slate-100 py-8 w-full flex flex-col items-center">
      {/* Boutons */}
      <div className="w-full max-w-2xl mb-4 flex justify-end gap-2 px-4 print:hidden">
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

      {/* Reçu */}
      <div className="w-full max-w-2xl bg-white shadow-lg p-10 print:shadow-none print:p-8">

        {/* En-tête */}
        <div className="flex justify-between items-start mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">RentEase</h1>
            <p className="text-slate-500 text-sm">Gestion de locations immobilières</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-800">REÇU DE PAIEMENT</h2>
            <p className="text-blue-600 font-medium">{numeroRecu}</p>
            <p className="text-slate-500 text-sm">
              {new Date(paiement.datePaiement).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Infos bailleur et locataire */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Reçu de
            </h3>
            <p className="text-slate-800 font-medium">
              {paiement.contrat.locataire.nom}{' '}
              {paiement.contrat.locataire.prenom}
            </p>
            <p className="text-slate-600 text-sm">
              {paiement.contrat.locataire.telephone}
            </p>
            <p className="text-slate-600 text-sm">
              {paiement.contrat.locataire.email}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Bailleur
            </h3>
            <p className="text-slate-800 font-medium">
              {paiement.contrat.chambre.bien.proprietaire.nom}{' '}
              {paiement.contrat.chambre.bien.proprietaire.prenom}
            </p>
            <p className="text-slate-600 text-sm">
              {paiement.contrat.chambre.bien.proprietaire.telephone}
            </p>
            <p className="text-slate-600 text-sm">
              {paiement.contrat.chambre.bien.proprietaire.email}
            </p>
          </div>
        </div>

        {/* Détails du bien */}
        <div className="bg-slate-50 rounded-lg p-4 mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
            Bien loué
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-slate-800">
              <span className="font-medium">Bien :</span>{' '}
              {paiement.contrat.chambre.bien.nom}
            </p>
            <p className="text-slate-800">
              <span className="font-medium">Adresse :</span>{' '}
              {paiement.contrat.chambre.bien.adresse}
            </p>
            <p className="text-slate-800">
              <span className="font-medium">Chambre N° :</span>{' '}
              {paiement.contrat.chambre.numero}
            </p>
            <p className="text-slate-800">
              <span className="font-medium">Mois :</span>{' '}
              {paiement.moisConcerne}
            </p>
          </div>
        </div>

        {/* Montant */}
        <div className="border-2 border-blue-600 rounded-lg p-6 mb-8 text-center">
          <p className="text-slate-500 text-sm mb-1">Montant payé</p>
          <p className="text-4xl font-bold text-blue-600">
            {paiement.montant.toLocaleString()} FCFA
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Pour le mois de {paiement.moisConcerne}
          </p>
        </div>

        {/* Statut */}
        <div className="flex justify-center mb-8">
          <span className="bg-green-100 text-green-700 px-6 py-2 rounded-full font-medium">
            ✅ Paiement confirmé
          </span>
        </div>

        {/* Signature */}
        <div className="grid grid-cols-2 gap-8 mt-12">
          <div className="text-center">
            <div className="border-t border-slate-400 pt-2 mt-16">
              <p className="text-slate-600 text-sm">Signature du Bailleur</p>
              <p className="text-slate-800 font-medium mt-1">
                {paiement.contrat.chambre.bien.proprietaire.nom}{' '}
                {paiement.contrat.chambre.bien.proprietaire.prenom}
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-400 pt-2 mt-16">
              <p className="text-slate-600 text-sm">Signature du Locataire</p>
              <p className="text-slate-800 font-medium mt-1">
                {paiement.contrat.locataire.nom}{' '}
                {paiement.contrat.locataire.prenom}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t text-slate-400 text-xs">
          RentEase — Gestion de locations immobilières
          | Généré le {new Date().toLocaleDateString('fr-FR')}
        </div>

      </div>
    </div>
  )
}