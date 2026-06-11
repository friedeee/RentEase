'use client'

import { useState, useEffect } from 'react'
import Toast from '@/app/components/Toast'
import Sidebar from '@/app/components/Sidebar'
import { useSidebar } from '@/app/context/SidebarContext'

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
  const { collapsed } = useSidebar()
  const [chambres, setChambres] = useState<Chambre[]>([])
  const [biens, setBiens] = useState<Bien[]>([])
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)
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
    try {
      const res = await fetch('/api/chambres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          superficie: parseFloat(form.superficie),
          loyer: parseFloat(form.loyer)
        })
      })
      if (res.ok) {
        setForm({ numero: '', superficie: '', loyer: '', bienId: '' })
        setShowForm(false)
        fetchChambres()
        setToast({ message: 'Chambre ajoutée avec succès !', type: 'success' })
      } else {
        setToast({ message: "Erreur lors de l'ajout !", type: 'error' })
      }
    } catch {
      setToast({ message: 'Erreur serveur !', type: 'error' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/chambres/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchChambres()
        setToast({ message: 'Chambre supprimée !', type: 'success' })
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

      <Sidebar active="/chambres" />

      <div style={{ marginLeft: collapsed ? '72px' : '260px', transition: 'margin 0.3s ease' }}
        className="p-8 pb-16">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Chambres</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Ajouter
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Nouvelle chambre</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input required placeholder="Numéro" value={form.numero}
                onChange={e => setForm({...form, numero: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800" />
              <input required type="number" placeholder="Superficie (m²)" value={form.superficie}
                onChange={e => setForm({...form, superficie: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800" />
              <input required type="number" placeholder="Loyer mensuel (FCFA)" value={form.loyer}
                onChange={e => setForm({...form, loyer: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800" />
              <select required value={form.bienId}
                onChange={e => setForm({...form, bienId: e.target.value})}
                className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800">
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

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 border-b">
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
                  <td colSpan={6} className="text-center py-8 text-slate-600">
                    Aucune chambre enregistrée
                  </td>
                </tr>
              ) : (
                chambres.map(c => (
                  <tr key={c.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-800">{c.numero}</td>
                    <td className="px-6 py-4 text-slate-800">{c.bien?.nom}</td>
                    <td className="px-6 py-4 text-slate-800">{c.superficie} m²</td>
                    <td className="px-6 py-4 text-slate-800">{c.loyer.toLocaleString()} FCFA</td>
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
                      <button onClick={() => handleDelete(c.id)}
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