'use client'

import { useState, useEffect } from 'react'
import Toast from '@/app/components/Toast'

type Paiement = {
  id: string
  montant: number
  datePaiement: string
  moisConcerne: string
  statut: string
  contrat: {
    locataire: { nom: string; prenom: string }
    chambre: { numero: string; bien: { nom: string } }
  }
}

type Contrat = {
  id: string
  locataire: { nom: string; prenom: string }
  chambre: { numero: string; bien: { nom: string } }
  loyer: number
}

export default function PaiementsPage() {
  const [paiements, setPaiements] = useState<Paiement[]>([])
  const [contrats, setContrats] = useState<Contrat[]>([])
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [form, setForm] = useState({
    contratId: '', montant: '', moisConcerne: ''
  })

  const mois = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]
  const annee = new Date().getFullYear()

  const fetchPaiements = async () => {
    const res = await fetch('/api/paiements')
    const data = await res.json()
    setPaiements(data)
  }

  const fetchContrats = async () => {
    const res = await fetch('/api/contrats')
    const data = await res.json()
    setContrats(data.filter((c: any) => c.statut === 'actif'))
  }

  useEffect(() => {
    fetchPaiements()
    fetchContrats()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/paiements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          montant: parseFloat(form.montant)
        })
      })
      if (res.ok) {
        setForm({ contratId: '', montant: '', moisConcerne: '' })
        setShowForm(false)
        fetchPaiements()
        setToast({ message: 'Paiement enregistré avec succès !', type: 'success' })
      } else {
        setToast({ message: "Erreur lors de l'enregistrement !", type: 'error' })
      }
    } catch {
      setToast({ message: 'Erreur serveur !', type: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="fixed left-0 top-0 h-full w-64 bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">RentEase</h1>
        <nav className="space-y-2">
          <a href="/" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Dashboard</a>
          <a href="/proprietaires" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Propriétaires</a>
          <a href="/biens" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Biens</a>
          <a href="/chambres" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Chambres</a>
          <a href="/locataires" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Locataires</a>
          <a href="/contrats" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Contrats</a>
          <a href="/paiements" className="block px-4 py-2 rounded-lg bg-blue-700">Paiements</a>
          <a href="/recus" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Reçus</a>
        </nav>
      </div>

      <div className="ml-16 lg:ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Paiements</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Enregistrer un paiement
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Nouveau paiement</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <select required value={form.contratId}
                onChange={e => {
                  const contrat = contrats.find(c => c.id === e.target.value)
                  setForm({
                    ...form,
                    contratId: e.target.value,
                    montant: contrat ? contrat.loyer.toString() : ''
                  })
                }}
                className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800">
                <option value="">-- Contrat --</option>
                {contrats.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.locataire.nom} {c.locataire.prenom} — Ch.{c.chambre.numero}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <select required value={form.moisConcerne.split(' ')[0] || ''}
                  onChange={e => setForm({
                    ...form,
                    moisConcerne: `${e.target.value} ${form.moisConcerne.split(' ')[1] || annee}`
                  })}
                  className="flex-1 border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800">
                  <option value="">-- Mois --</option>
                  {mois.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select required value={form.moisConcerne.split(' ')[1] || annee}
                  onChange={e => setForm({
                    ...form,
                    moisConcerne: `${form.moisConcerne.split(' ')[0] || ''} ${e.target.value}`
                  })}
                  className="w-28 border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800">
                  {[annee - 1, annee, annee + 1].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <input required type="number" placeholder="Montant (FCFA)" value={form.montant}
                onChange={e => setForm({...form, montant: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800" />

              <div className="col-span-2 flex gap-2">
                <button type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Enregistrer
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Locataire</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Chambre</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Mois</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Montant</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Date</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Statut</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paiements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-600">
                    Aucun paiement enregistré
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
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {p.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`/recus/${p.id}`} className="text-blue-500 hover:text-blue-700 text-sm">🧾 Reçu</a>
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