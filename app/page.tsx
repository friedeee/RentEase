export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">RentEase</h1>
        <nav className="space-y-2">
          <a href="/" className="block px-4 py-2 rounded-lg bg-blue-700">Dashboard</a>
          <a href="/proprietaires" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Propriétaires</a>
          <a href="/biens" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Biens</a>
          <a href="/chambres" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Chambres</a>
          <a href="/locataires" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Locataires</a>
          <a href="/contrats" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Contrats</a>
          <a href="/paiements" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Paiements</a>
          <a href="/recus" className="block px-4 py-2 rounded-lg hover:bg-blue-700">Reçus</a>
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Tableau de bord</h2>
          <span className="text-slate-500">Bienvenue, Administrateur</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">Total Chambres</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">Chambres Occupées</p>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">Chambres Libres</p>
            <p className="text-3xl font-bold text-orange-500 mt-2">0</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm">Locataires Actifs</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
          </div>
        </div>

        {/* Tableau loyers impayés */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Loyers impayés
          </h3>
          <p className="text-slate-500 text-sm">Aucun loyer impayé pour le moment.</p>
        </div>

      </div>
    </div>
  )
}