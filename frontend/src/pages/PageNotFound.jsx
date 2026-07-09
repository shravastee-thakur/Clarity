import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-[#0344a6]/10 mb-4 select-none">
          404
        </h1>
        <h2 className="text-2xl font-bold text-[#172b4d] mb-2">
          Page not found
        </h2>
        <p className="text-[#172b4d]/60 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0344a6] text-white font-semibold rounded-lg hover:bg-[#0344a6]/90 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-[#172b4d] font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
