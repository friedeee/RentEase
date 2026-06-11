'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Toast from '@/app/components/Toast'
import Sidebar from '@/app/components/Sidebar'
import { useSidebar } from '@/app/context/SidebarContext'

type Contrat = {
  id: string
  dateDebut: string
  dateFin: string | null
  loyer: number
  caution: number
  statut: string
  locataire: { nom: string; prenom: string }
  chambre: { numero: string; bien: { nom: string } }
  ReglementContrat: { id: string; texte: string }[]
}

type Locataire = {
  id: string
  nom: string
  prenom: string
}

type Chambre = {
  id: string
  numero: string
  bien: { nom: string }
}

const REGLEMENTS_PAR_DEFAUT = [
  'Payer le loyer avant le 5 de chaque mois',
  'Ne pas jouer de la musique après 22h',
  'Balayer la cour tous les jours',
  'Ne pas sous-louer la chambre sans autorisation',
  'Ne pas faire de travaux sans autorisation',
  'Les animaux domestiques sont interdits',
  'Respecter le calme des voisins',
]

export default function ContratsPage() {
  const { collapsed } = useSidebar()
  const [contrats, setContrats] = useState<Contrat[]>([])
  const [locataires, setLocataires] = useState<Locataire[]>([])
  const [chambres, setChambres] = useState<Chambre[]>([])
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [reglements, setReglements] = useState<string[]>(REGLEMENTS_PAR_DEFAUT)
  const [newReglement, setNewReglement] = useState('')
  const [form, setForm] = useState({
    locataireId: '', chambreId: '',
    dateDebut: '', dateFin: '',
    loyer: '', caution: ''
  })
  const router = useRouter()

  const fetchContrats = async () => {
    const res = await fetch('/api/contrats')
    const data = await res.json()
    setContrats(data)
  }

  const fetchLocataires = async () => {
    const res = await fetch('/api/locataires')
    const data = await res.json()
    setLocataires(data)
  }

  const fetchChambres = async () => {
    const res = await fetch('/api/chambres')
    const data = await res.json()
    setChambres(data.filter((c: any) => c.statut === 'libre'))
  }

  useEffect(() => {
    fetchContrats()
    fetchLocataires()
    fetchChambres()
  }, [])

  const addReglement = () => {
    if (newReglement.trim()) {
      setReglements([...reglements, newReglement.trim()])
      setNewReglement('')
    }
  }

  const removeReglement = (index: number) => {
    setReglements(reglements.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/contrats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          loyer: parseFloat(form.loyer),
          caution: parseFloat(form.caution),
          dateFin: form.dateFin || null,
          reglements
        })
      })
      if (res.ok) {
        setForm({
          locataireId: '', chambreId: '',
          dateDebut: '', dateFin: '',
          loyer: '', caution: ''
        })
        setReglements(REGLEMENTS_PAR_DEFAUT)
        setShowForm(false)
        fetchContrats()
        fetchChambres()
        setToast({ message: 'Contrat créé avec succès !', type: 'success' })
      } else {
        setToast({ message: 'Erreur lors de la création !', type: 'error' })
      }
    } catch {
      setToast({ message: 'Erreur serveur !', type: 'error' })
    }
  }

  const handleResilier = async (id: string) => {
    try {
      const res = await fetch(`/api/contrats/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: 'résilié' })
      })
      if (res.ok) {
        fetchContrats()
        setToast({ message: 'Contrat résilié !', type: 'success' })
      } else {
        setToast({ message: 'Erreur lors de la résiliation !', type: 'error' })
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

      <Sidebar active="/contrats" />

      <div style={{ marginLeft: collapsed ? '72px' : '260px', transition: 'margin 0.3s ease' }}
        className="p-8 pb-16">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Contrats</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Nouveau contrat
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Nouveau contrat</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select required value={form.locataireId}
                  onChange={e => setForm({...form, locataireId: e.target.value})}
                  className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800">
                  <option value="">-- Locataire --</option>
                  {locataires.map(l => (
                    <option key={l.id} value={l.id}>{l.nom} {l.prenom}</option>
                  ))}
                </select>
                <select required value={form.chambreId}
                  onChange={e => setForm({...form, chambreId: e.target.value})}
                  className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800">
                  <option value="">-- Chambre libre --</option>
                  {chambres.map(c => (
                    <option key={c.id} value={c.id}>{c.numero} — {c.bien?.nom}</option>
                  ))}
                </select>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Date début</label>
                  <input required type="date" value={form.dateDebut}
                    onChange={e => setForm({...form, dateDebut: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Date fin (optionnel)</label>
                  <input type="date" value={form.dateFin}
                    onChange={e => setForm({...form, dateFin: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800" />
                </div>
                <input required type="number" placeholder="Loyer mensuel (FCFA)" value={form.loyer}
                  onChange={e => setForm({...form, loyer: e.target.value})}
                  className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800" />
                <input required type="number" placeholder="Caution (FCFA)" value={form.caution}
                  onChange={e => setForm({...form, caution: e.target.value})}
                  className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-800" />
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-800 mb-3">Règlements du contrat</h4>
                <ul className="space-y-2 mb-4">
                  {reglements.map((r, i) => (
                    <li key={i} className="flex items-center justify-between bg-slate-100 px-3 py-2 rounded-lg">
                      <span className="text-sm text-slate-800">• {r}</span>
                      <button type="button" onClick={() => removeReglement(i)}
                        className="text-red-400 hover:text-red-600 text-xs ml-2">✕</button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input type="text" placeholder="Ajouter un règlement..."
                    value={newReglement}
                    onChange={e => setNewReglement(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white text-slate-800" />
                  <button type="button" onClick={addReglement}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800">
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
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
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Date début</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Loyer</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Caution</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Statut</th>
                <th className="text-left px-6 py-3 text-slate-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contrats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-600">
                    Aucun contrat enregistré
                  </td>
                </tr>
              ) : (
                contrats.map(c => (
                  <tr key={c.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-800">
                      {c.locataire?.nom} {c.locataire?.prenom}
                    </td>
                    <td className="px-6 py-4 text-slate-800">
                      {c.chambre?.numero} — {c.chambre?.bien?.nom}
                    </td>
                    <td className="px-6 py-4 text-slate-800">
                      {new Date(c.dateDebut).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-slate-800">{c.loyer.toLocaleString()} FCFA</td>
                    <td className="px-6 py-4 text-slate-800">{c.caution.toLocaleString()} FCFA</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        c.statut === 'actif'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {c.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => router.push(`/contrats/${c.id}/pdf`)}
                        className="text-blue-500 hover:text-blue-700 text-sm">
                        📄 PDF
                      </button>
                      {c.statut === 'actif' && (
                        <button onClick={() => handleResilier(c.id)}
                          className="text-red-500 hover:text-red-700 text-sm">
                          Résilier
                        </button>
                      )}
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