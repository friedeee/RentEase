'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/app/components/Sidebar'
import { useSidebar } from '@/app/context/SidebarContext'

type Paiement = {
  id: string
  montant: number
  datePaiement: string
  moisConcerne: string
  contrat: {
    locataire: { nom: string; prenom: string }
    chambre: { numero: string; bien: { nom: string } }
  }
}

export default function RecusPage() {
  const { collapsed } = useSidebar()
  const [paiements, setPaiements] = useState<Paiement[]>([])

  useEffect(() => {
    fetch('/api/paiements')
      .then(res => res.json())
      .then(data => setPaiements(data))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar active="/recus" />

      <div style={{ marginLeft: collapsed ? '72px' : '260px', transition: 'margin 0.3s ease' }}
        className="p-8 pb-16">

        <h2 className="text-2xl font-bold text-slate-800 mb-8">Reçus</h2>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Locataire</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Chambre</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Mois</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Montant</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Date</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paiements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-600">
                    Aucun reçu disponible
                  </td>
                </tr>
              ) : (
                paiements.map(p => (
                  <tr key={p.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-800">
                      {p.contrat?.locataire?.nom} {p.contrat?.locataire?.prenom}
                    </td>
                    <td className="px-6 py-4 text-slate-800">
                      Ch.{p.contrat?.chambre?.numero} — {p.contrat?.chambre?.bien?.nom}
                    </td>
                    <td className="px-6 py-4 text-slate-800">{p.moisConcerne}</td>
                    <td className="px-6 py-4 text-slate-800">{p.montant.toLocaleString()} FCFA</td>
                    <td className="px-6 py-4 text-slate-800">
                      {new Date(p.datePaiement).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <a href={`/recus/${p.id}`} className="text-blue-500 hover:text-blue-700 text-sm">
                        🧾 Voir le reçu
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}