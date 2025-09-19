export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to NotesHub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern notes management application
          </p>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">🚀 Getting Started</h2>
              <p className="text-gray-600">
                This is the frontend application of NotesHub. The backend API should be running on port 3001.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">🏗️ Development Setup</h2>
              <p className="text-gray-600">
                Run <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code> to start the development server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}