import { PrismaClient } from '@prisma/client'
import Sidebar from '@/app/components/Sidebar'

const prisma = new PrismaClient()
export default async function Dashboard() {
  const totalChambres = await prisma.chambre.count()
  const chambresOccupees = await prisma.chambre.count({ where: { statut: 'occupée' } })
  const chambresLibres = await prisma.chambre.count({ where: { statut: 'libre' } })
  const locatairesActifs = await prisma.contrat.count({ where: { statut: 'actif' } })
  const paiementsDuMois = await prisma.paiement.findMany({
    where: {
      datePaiement: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    },
    include: {
      contrat: {
        include: {
          locataire: true,
          chambre: { include: { bien: true } }
        }
      }
    },
    orderBy: { datePaiement: 'desc' },
    take: 5
  })

  const totalPaiementsMois = paiementsDuMois.reduce(
    (acc, p) => acc + p.montant, 0
  )

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar active="/" />

      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Tableau de bord</h2>
          <span className="text-slate-500">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long', year: 'numeric',
              month: 'long', day: 'numeric'
            })}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
            <p className="text-slate-500 text-sm">Total Chambres</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{totalChambres}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
            <p className="text-slate-500 text-sm">Chambres Occupées</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{chambresOccupees}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-500">
            <p className="text-slate-500 text-sm">Chambres Libres</p>
            <p className="text-3xl font-bold text-orange-500 mt-2">{chambresLibres}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
            <p className="text-slate-500 text-sm">Locataires Actifs</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{locatairesActifs}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 border-l-4 border-blue-500">
          <p className="text-slate-500 text-sm">Total paiements ce mois</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {totalPaiementsMois.toLocaleString()} FCFA
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Derniers paiements du mois
          </h3>
          {paiementsDuMois.length === 0 ? (
            <p className="text-slate-500 text-sm">Aucun paiement ce mois.</p>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Locataire</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Chambre</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Mois</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Montant</th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {paiementsDuMois.map(p => (
                  <tr key={p.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-800">
                      {p.contrat.locataire.nom} {p.contrat.locataire.prenom}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      Ch.{p.contrat.chambre.numero} — {p.contrat.chambre.bien.nom}
                    </td>
                    <td className="px-4 py-3 text-slate-800">{p.moisConcerne}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium text-blue-600">
                      {p.montant.toLocaleString()} FCFA
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {new Date(p.datePaiement).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}