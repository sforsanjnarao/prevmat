// components/LoadingPage.tsx
import { Loader2 } from "lucide-react"; // or use any icon lib
import { motion } from "framer-motion";

export default function LoadingPage() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    </motion.div>
  );
}
