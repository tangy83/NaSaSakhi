export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          NaariSamata
        </h1>
        <h2 className="text-2xl text-gray-700 mb-6">
          Organization Registration Portal
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Empowering women and children across India through accessible support services
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6 text-left">
          <h3 className="text-xl font-semibold mb-4">Project Status:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Next.js 15 with TypeScript initialized</li>
            <li>✅ Tailwind CSS configured</li>
            <li>✅ Git repository connected to GitHub</li>
            <li>🔄 Phase 0: Data migration scripts - In Progress</li>
            <li>⏳ Phase 1: Database schema design - Pending</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
