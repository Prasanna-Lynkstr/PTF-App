import Header from "@/components/header";
import Footer from "@/components/footer";


export default function NoAccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="z-50 relative border-b border-gray-200 bg-white">
        <Header />
      </div>
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 pb-6">
       
        <main className="flex-1">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-red-600 mb-2">Access Denied</h1>
              <p className="text-gray-700 mb-4">You are not authorized to view this page.</p>
              <a href="/hiring-org" className="text-blue-600 underline">Go to Homepage</a>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}