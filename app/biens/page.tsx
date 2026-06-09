'use client'

import { useState, useEffect } from 'react'
import Toast from '@/app/components/Toast'

type Bien = {
  id: string
  nom: string
  adresse: string
  type: string
  proprietaireId: string
  proprietaire: { nom: string; prenom: string }
}

type Proprietaire = {
  id: string
  nom: string
  prenom: string
}

export default function BiensPage() {
  const [biens, setBiens] = useState<Bien[]>([])
  const [proprietaires, setProprietaires] = useState<Proprietaire[]>([])
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [form, setForm] = useState({
    nom: '', adresse: '', type: '', proprietaireId: ''
  })

  const fetchBiens = async () => {
    const res = await fetch('/api/biens')
    const data = await res.json()
    setBiens(data)
  }

  const fetchProprietaires = async () => {
    const res = await fetch('/api/proprietaires')
    const data = await res.json()
    setProprietaires(data)
  }

  useEffect(() => {
    fetchBiens()
    fetchProprietaires()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/biens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setForm({ nom: '', adresse: '', type: '', proprietaireId: '' })
        setShowForm(false)
        fetchBiens()
        setToast({ message: 'Bien ajouté avec succès !', type: 'success' })
      } else {
        setToast({ message: "Erreur lors de l'ajout !", type: 'error' })
      }
    } catch {
      setToast({ message: 'Erreur serveur !', type: 'error' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/biens/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchBiens()
        setToast({ message: 'Bien supprimé !', type: 'success' })
      } else {
        setToast({ message: 'Erreur lors de la suppression !', type: 'error' })
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
          <a href="/biens" className="block px-4 py-2 rounded-lg bg-blue-700">Biens</a>
          <a href="/chambres" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Chambres</a>
          <a href="/locataires" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Locataires</a>
          <a href="/contrats" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Contrats</a>
          <a href="/paiements" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Paiements</a>
          <a href="/recus" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Reçus</a>
        </nav>
      </div>

      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Biens immobiliers</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Ajouter
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Nouveau bien</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input required placeholder="Nom du bien" value={form.nom}
                onChange={e => setForm({...form, nom: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800" />
              <input required placeholder="Adresse" value={form.adresse}
                onChange={e => setForm({...form, adresse: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800" />
              <select required value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800">
                <option value="">-- Type de bien --</option>
                <option value="appartement">Appartement</option>
                <option value="maison">Maison</option>
                <option value="immeuble">Immeuble</option>
                <option value="villa">Villa</option>
              </select>
              <select required value={form.proprietaireId}
                onChange={e => setForm({...form, proprietaireId: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800">
                <option value="">-- Propriétaire --</option>
                {proprietaires.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nom} {p.prenom}
                  </option>
                ))}
              </select>
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
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Nom</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Adresse</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Type</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Propriétaire</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {biens.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-600">
                    Aucun bien enregistré
                  </td>
                </tr>
              ) : (
                biens.map(b => (
                  <tr key={b.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-800">{b.nom}</td>
                    <td className="px-6 py-4 text-slate-800">{b.adresse}</td>
                    <td className="px-6 py-4 text-slate-800 capitalize">{b.type}</td>
                    <td className="px-6 py-4 text-slate-800">
                      {b.proprietaire?.nom} {b.proprietaire?.prenom}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(b.id)}
                        className="text-red-500 hover:text-red-700 text-sm">
                        Supprimer
                      </button>
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