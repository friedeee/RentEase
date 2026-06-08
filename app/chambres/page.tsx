'use client'

import { useState, useEffect } from 'react'

type Chambre = {
  id: string
  numero: string
  superficie: number
  loyer: number
  statut: string
  bienId: string
  bien: { nom: string }
}

type Bien = {
  id: string
  nom: string
}

export default function ChambresPage() {
  const [chambres, setChambres] = useState<Chambre[]>([])
  const [biens, setBiens] = useState<Bien[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    numero: '', superficie: '', loyer: '', bienId: ''
  })

  const fetchChambres = async () => {
    const res = await fetch('/api/chambres')
    const data = await res.json()
    setChambres(data)
  }

  const fetchBiens = async () => {
    const res = await fetch('/api/biens')
    const data = await res.json()
    setBiens(data)
  }

  useEffect(() => {
    fetchChambres()
    fetchBiens()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/chambres', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        superficie: parseFloat(form.superficie),
        loyer: parseFloat(form.loyer)
      })
    })
    setForm({ numero: '', superficie: '', loyer: '', bienId: '' })
    setShowForm(false)
    fetchChambres()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/chambres/${id}`, { method: 'DELETE' })
    fetchChambres()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">RentEase</h1>
        <nav className="space-y-2">
          <a href="/" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Dashboard</a>
          <a href="/proprietaires" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Propriétaires</a>
          <a href="/biens" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Biens</a>
          <a href="/chambres" className="block px-4 py-2 rounded-lg bg-blue-700">Chambres</a>
          <a href="/locataires" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Locataires</a>
          <a href="/contrats" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Contrats</a>
          <a href="/paiements" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Paiements</a>
          <a href="/recus" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Reçus</a>
        </nav>
      </div>

      {/* Main */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Chambres</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Ajouter
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4">Nouvelle chambre</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input required placeholder="Numéro" value={form.numero}
                onChange={e => setForm({...form, numero: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2" />
              <input required type="number" placeholder="Superficie (m²)" value={form.superficie}
                onChange={e => setForm({...form, superficie: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2" />
              <input required type="number" placeholder="Loyer mensuel (FCFA)" value={form.loyer}
                onChange={e => setForm({...form, loyer: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2" />
              <select required value={form.bienId}
                onChange={e => setForm({...form, bienId: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2">
                <option value="">-- Bien immobilier --</option>
                {biens.map(b => (
                  <option key={b.id} value={b.id}>{b.nom}</option>
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

        {/* Tableau */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Numéro</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Bien</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Superficie</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Loyer</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Statut</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chambres.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Aucune chambre enregistrée
                  </td>
                </tr>
              ) : (
                chambres.map(c => (
                  <tr key={c.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4">{c.numero}</td>
                    <td className="px-6 py-4">{c.bien?.nom}</td>
                    <td className="px-6 py-4">{c.superficie} m²</td>
                    <td className="px-6 py-4">{c.loyer.toLocaleString()} FCFA</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        c.statut === 'libre'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {c.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
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