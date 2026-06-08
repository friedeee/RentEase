'use client'

import { useState, useEffect } from 'react'

type Locataire = {
  id: string
  nom: string
  prenom: string
  telephone: string
  email: string
  cni: string
  profession: string
}

export default function LocatairesPage() {
  const [locataires, setLocataires] = useState<Locataire[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    nom: '', prenom: '', telephone: '', email: '', cni: '', profession: ''
  })

  const fetchLocataires = async () => {
    const res = await fetch('/api/locataires')
    const data = await res.json()
    setLocataires(data)
  }

  useEffect(() => { fetchLocataires() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/locataires', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ nom: '', prenom: '', telephone: '', email: '', cni: '', profession: '' })
    setShowForm(false)
    fetchLocataires()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/locataires/${id}`, { method: 'DELETE' })
    fetchLocataires()
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
          <a href="/chambres" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Chambres</a>
          <a href="/locataires" className="block px-4 py-2 rounded-lg bg-blue-700">Locataires</a>
          <a href="/contrats" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Contrats</a>
          <a href="/paiements" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Paiements</a>
          <a href="/recus" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Reçus</a>
        </nav>
      </div>

      {/* Main */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Locataires</h2>
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
            <h3 className="text-lg font-semibold mb-4">Nouveau locataire</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input required placeholder="Nom" value={form.nom}
                onChange={e => setForm({...form, nom: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2" />
              <input required placeholder="Prénom" value={form.prenom}
                onChange={e => setForm({...form, prenom: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2" />
              <input required placeholder="Téléphone" value={form.telephone}
                onChange={e => setForm({...form, telephone: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2" />
              <input required placeholder="Email" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2" />
              <input required placeholder="Numéro CNI" value={form.cni}
                onChange={e => setForm({...form, cni: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2" />
              <input required placeholder="Profession" value={form.profession}
                onChange={e => setForm({...form, profession: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2" />
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
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Nom</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Prénom</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Téléphone</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">CNI</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Profession</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locataires.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Aucun locataire enregistré
                  </td>
                </tr>
              ) : (
                locataires.map(l => (
                  <tr key={l.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4">{l.nom}</td>
                    <td className="px-6 py-4">{l.prenom}</td>
                    <td className="px-6 py-4">{l.telephone}</td>
                    <td className="px-6 py-4">{l.cni}</td>
                    <td className="px-6 py-4">{l.profession}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(l.id)}
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