import { AlertCircle } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-lg font-semibold">Monitoring Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Last updated: 1m ago</span>
        </div>
      </div>
    </nav>
  );
}
