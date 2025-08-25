import Header from "@/components/header";
import Footer from "@/components/footer";
import MainSidebar from "@/components/MainSidebar";

export default function Template() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="z-50 relative border-b border-gray-200 bg-white">
        <Header />
      </div>
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 pb-6">
        <MainSidebar />
        <main className="flex-1">
          {/* Page content can go here */}
        </main>
      </div>
      <Footer />
    </div>
  );
}