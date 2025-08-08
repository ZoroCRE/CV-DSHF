import React, { useState, useEffect, useMemo } from 'react';
import { FiFileText, FiThumbsUp, FiCheckCircle, FiTrendingUp, FiXCircle, FiDownload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip'

// --- TYPE DEFINITIONS ---
interface CVResult {
  id: string;
  fileName: string;
  matchPercentage: number;
}

interface AnalysisData {
  totalCVs: number;
  analysisKeywords: string[];
  results: CVResult[];
}

type Category = 'Excellent' | 'Very Good' | 'Good' | 'Unsuitable';

interface CategorizedResults {
  Excellent: CVResult[];
  'Very Good': CVResult[];
  Good: CVResult[];
  Unsuitable: CVResult[];
}

// --- MOCK API DATA ---
// This simulates the data structure from your backend.
const MOCK_DATA: AnalysisData = {
  totalCVs: 125,
  analysisKeywords: ["Python", "Data Analysis", "Project Management", "React", "Node.js"],
  results: [
    { id: "cv001", fileName: "John_Doe_Resume.pdf", matchPercentage: 95 },
    { id: "cv002", fileName: "Jane_Smith_CV.docx", matchPercentage: 78 },
    { id: "cv003", fileName: "Peter_Jones.pdf", matchPercentage: 60 },
    { id: "cv004", fileName: "Emily_White.pdf", matchPercentage: 48 },
    { id: "cv005", fileName: "Michael_Brown.docx", matchPercentage: 25 },
    { id: "cv006", fileName: "Sarah_Davis_Portfolio.pdf", matchPercentage: 88 },
    { id: "cv007", fileName: "David_Wilson_CV.pdf", matchPercentage: 92 },
    { id: "cv008", fileName: "Laura_Taylor_Resume.docx", matchPercentage: 71 },
    { id: "cv009", fileName: "James_Anderson_CV.pdf", matchPercentage: 55 },
    { id: "cv010", fileName: "Linda_Thomas_Profile.pdf", matchPercentage: 40 },
    // Adding more data for a realistic look
    ...Array.from({ length: 115 }, (_, i) => ({
      id: `cv${11 + i}`,
      fileName: `candidate_${11 + i}_cv.pdf`,
      matchPercentage: Math.floor(Math.random() * 100) + 1,
    })),
  ],
};

// --- HELPER FUNCTIONS & CONFIG ---
const getCategory = (percentage: number): Category => {
  if (percentage > 80) return 'Excellent';
  if (percentage > 65) return 'Very Good';
  if (percentage > 44) return 'Good';
  return 'Unsuitable';
};

const CATEGORY_CONFIG: Record<Category, { icon: React.ElementType; color: string; emoji: string; }> = {
  Excellent: { icon: FiCheckCircle, color: 'text-emerald-400', emoji: '⭐' },
  'Very Good': { icon: FiThumbsUp, color: 'text-sky-400', emoji: '👍' },
  Good: { icon: FiTrendingUp, color: 'text-amber-400', emoji: '🙂' },
  Unsuitable: { icon: FiXCircle, color: 'text-rose-400', emoji: '👎' },
};

// --- UI COMPONENTS ---

// Animated Counter Component
const AnimatedCounter: React.FC<{ value: number; className?: string; isPercentage?: boolean }> = ({ value, className, isPercentage = false }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = {
      update: (latest: number) => {
        setDisplayValue(parseFloat(latest.toFixed(isPercentage ? 1 : 0)));
      },
    };

    // Animate from 0 to value
    const animate = (target: number) => {
      const start = 0;
      const duration = 1500; // ms
      let startTimestamp: number | null = null;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = progress * (target - start) + start;
        controls.update(current);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    animate(value);

  }, [value, isPercentage]);

  return <span className={className}>{displayValue}{isPercentage ? '%' : ''}</span>;
};


// CV Card Component
const CVCard: React.FC<{ result: CVResult }> = ({ result }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors duration-200"
  >
    <div className="flex items-center gap-3 min-w-0">
      <FiFileText className="text-slate-400 flex-shrink-0" />
      <p className="text-sm text-slate-200 truncate" data-tooltip-id="filename-tooltip" data-tooltip-content={result.fileName}>
        {result.fileName}
      </p>
    </div>
    <span className="text-sm font-semibold text-slate-100 bg-slate-600/70 px-2 py-1 rounded-md">
      {result.matchPercentage}%
    </span>
  </motion.div>
);

// Category Column Component
const CategoryColumn: React.FC<{
  category: Category;
  results: CVResult[];
  totalCVs: number;
}> = ({ category, results, totalCVs }) => {
  const config = CATEGORY_CONFIG[category];
  const percentage = totalCVs > 0 ? (results.length / totalCVs) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex flex-col items-start mb-4">
        <div className='w-full flex justify-between items-center'>
            <span className="text-2xl">{config.emoji}</span>
            <div className="text-right">
                <AnimatedCounter value={percentage} className="text-2xl font-bold text-white" isPercentage />
                <p className="text-xs text-slate-400">of Total CVs</p>
            </div>
        </div>
        <h3 className={`text-lg font-bold ${config.color} mt-2`}>{category}</h3>
        <p className="text-sm text-slate-300">
          <AnimatedCounter value={results.length} className="font-semibold" /> CVs
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-1.5 mb-5">
        <motion.div
          className={`h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>

      {/* CV List */}
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {results.length > 0 ? (
              results.map(result => <CVCard key={result.id} result={result} />)
            ) : (
              <p className="text-center text-slate-500 text-sm py-10">No CVs in this category.</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock API fetch
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
            // In a real app, you would fetch from your API endpoint:
            const response = await fetch('https://cv-dshf.vercel.app/api/analyze'); // <--- YOUR REAL BACKEND URL
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();
            setData(result);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        setData(MOCK_DATA);

      } catch (err) {
        setError("Failed to fetch analysis data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categorizedResults = useMemo<CategorizedResults>(() => {
    const initial: CategorizedResults = { Excellent: [], 'Very Good': [], Good: [], Unsuitable: [] };
    if (!data) return initial;

    return data.results.reduce((acc, result) => {
      const category = getCategory(result.matchPercentage);
      acc[category].push(result);
      return acc;
    }, initial);
  }, [data]);

  const exportToCSV = () => {
    if (!data) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,File Name,Match Percentage,Category\n";

    data.results.forEach(result => {
        const category = getCategory(result.matchPercentage);
        const row = [result.id, result.fileName, result.matchPercentage, category].join(",");
        csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cv_analysis_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
            <FiFileText className="text-5xl text-sky-400" />
        </motion.div>
        <p className="mt-4 text-lg font-semibold">Analyzing CVs...</p>
        <p className="text-slate-400">Please wait a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <FiXCircle className="text-5xl text-rose-500" />
        <p className="mt-4 text-lg font-semibold">An Error Occurred</p>
        <p className="text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8">
      <Tooltip id="filename-tooltip" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">CV Analysis Dashboard</h1>
            <p className="text-slate-400 mt-1">
              Showing results for <span className="font-semibold text-sky-400">{data?.totalCVs}</span> CVs analyzed.
            </p>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
          >
            <FiDownload />
            Export to CSV
          </button>
        </header>

        {/* Keywords */}
        <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-300 mb-2">Analysis Keywords</h2>
            <div className="flex flex-wrap gap-2">
                {data?.analysisKeywords.map(keyword => (
                    <span key={keyword} className="bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1 rounded-full">
                        {keyword}
                    </span>
                ))}
            </div>
        </div>

        {/* Main Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {(Object.keys(categorizedResults) as Category[]).map(category => (
            <CategoryColumn
              key={category}
              category={category}
              results={categorizedResults[category]}
              totalCVs={data?.totalCVs || 0}
            />
          ))}
        </main>
      </div>
    </div>
  );
};

export default App;
