import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

// --- SVG ICON COMPONENTS ---
const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const ThumbsUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
);
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const TrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
);
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);


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
  Excellent: CVResult[]; 'Very Good': CVResult[]; Good: CVResult[]; Unsuitable: CVResult[];
}

// --- CONFIG & HELPERS ---
const API_ENDPOINT = 'https://cv-analyzer-app.vercel.app'; // Your backend URL

const getCategory = (percentage: number): Category => {
  if (percentage > 80) return 'Excellent';
  if (percentage > 65) return 'Very Good';
  if (percentage > 44) return 'Good';
  return 'Unsuitable';
};

const CATEGORY_CONFIG: Record<Category, { icon: React.ElementType; color: string; emoji: string; }> = {
  Excellent: { icon: CheckCircleIcon, color: 'text-emerald-400', emoji: '⭐' },
  'Very Good': { icon: ThumbsUpIcon, color: 'text-sky-400', emoji: '👍' },
  Good: { icon: TrendingUpIcon, color: 'text-amber-400', emoji: '🙂' },
  Unsuitable: { icon: XCircleIcon, color: 'text-rose-400', emoji: '👎' },
};

// --- UI COMPONENTS ---
const AnimatedCounter: React.FC<{ value: number; className?: string; isPercentage?: boolean }> = ({ value, className, isPercentage = false }) => {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        const controls = { update: (latest: number) => setDisplayValue(parseFloat(latest.toFixed(isPercentage ? 1 : 0))) };
        const animate = (target: number) => {
            let startTimestamp: number | null = null;
            const step = (timestamp: number) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / 1500, 1);
                controls.update(progress * target);
                if (progress < 1) window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        };
        animate(value);
    }, [value, isPercentage]);
    return <span className={className}>{displayValue}{isPercentage ? '%' : ''}</span>;
};

const CVCard: React.FC<{ result: CVResult }> = ({ result }) => (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700">
        <div className="flex items-center gap-3 min-w-0">
            <FileTextIcon className="text-slate-400 flex-shrink-0" />
            <p className="text-sm text-slate-200 truncate" data-tooltip-id="filename-tooltip" data-tooltip-content={result.fileName}>{result.fileName}</p>
        </div>
        <span className="text-sm font-semibold text-slate-100 bg-slate-600/70 px-2 py-1 rounded-md">{result.matchPercentage}%</span>
    </motion.div>
);

const CategoryColumn: React.FC<{ category: Category; results: CVResult[]; totalCVs: number; }> = ({ category, results, totalCVs }) => {
    const config = CATEGORY_CONFIG[category];
    const percentage = totalCVs > 0 ? (results.length / totalCVs) * 100 : 0;
    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 flex flex-col h-full">
            <div className="flex flex-col items-start mb-4">
                <div className='w-full flex justify-between items-center'>
                    <span className="text-2xl">{config.emoji}</span>
                    <div className="text-right">
                        <AnimatedCounter value={percentage} className="text-2xl font-bold text-white" isPercentage />
                        <p className="text-xs text-slate-400">of Total CVs</p>
                    </div>
                </div>
                <h3 className={`text-lg font-bold ${config.color} mt-2`}>{category}</h3>
                <p className="text-sm text-slate-300"><AnimatedCounter value={results.length} className="font-semibold" /> CVs</p>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mb-5">
                <motion.div className={`h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`} initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1.5, ease: "easeInOut" }} />
            </div>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                <div className="flex flex-col gap-3">
                    <AnimatePresence>
                        {results.length > 0 ? results.map(result => <CVCard key={result.id} result={result} />) : <p className="text-center text-slate-500 text-sm py-10">No CVs in this category.</p>}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

// --- MODIFIED: Toggles Component ---
const Toggles: React.FC<{
    isDarkMode: boolean;
    isArabic: boolean;
    toggleDarkMode: () => void;
    toggleLanguage: () => void;
}> = ({ isDarkMode, isArabic, toggleDarkMode, toggleLanguage }) => {
    return (
        // This container establishes the boundaries for positioning
        <div className="fixed top-6 left-6 right-6 h-8 z-50">
            {/* Language Toggle Wrapper - Always on the left */}
            <div className="absolute top-0 left-0">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isArabic} onChange={toggleLanguage} className="sr-only peer" />
                    <div className="w-14 h-8 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['EN'] after:absolute after:top-1 after:left-[4px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-6 after:w-6 after:transition-all after:text-slate-800 after:text-xs after:font-bold after:flex after:items-center after:justify-center peer-checked:after:content-['AR']"></div>
                </label>
            </div>
            {/* Dark Mode Toggle Wrapper - Always on the right */}
            <div className="absolute top-0 right-0">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} className="sr-only peer" />
                    <div className="w-14 h-8 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['☀️'] after:absolute after:top-1 after:left-[4px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-6 after:w-6 after:transition-all after:flex after:items-center after:justify-center peer-checked:after:content-['🌙']"></div>
                </label>
            </div>
        </div>
    );
};

const Uploader: React.FC<{ onUploadSuccess: (submissionId: number) => void; isArabic: boolean; }> = ({ onUploadSuccess, isArabic }) => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const uiText = {
        title: isArabic ? "تحليل السير الذاتية" : "Upload & Analyze CVs",
        keywordsLabel: isArabic ? "أدخل الكلمات المفتاحية" : "Enter Keywords",
        keywordsPlaceholder: isArabic ? "مثال: بايثون، تحليل بيانات" : "e.g., Python, Data Analysis",
        uploadLabel: isArabic ? "رفع السير الذاتية" : "Upload CVs",
        uploadPlaceholder: isArabic ? "اسحب وأفلت الملفات أو انقر للاختيار" : "Drag & drop files here or click to select",
        filesSelected: isArabic ? "ملفات تم اختيارها" : "file(s) selected",
        submitButton: isArabic ? "تحليل وتقديم" : "Analyze and Submit",
        submittingButton: isArabic ? "جاري التحليل..." : "Analyzing...",
        fileError: isArabic ? "الرجاء اختيار ملف واحد على الأقل." : "Please select at least one file.",
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles(e.target.files);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!files || files.length === 0) {
            setError(uiText.fileError);
            return;
        }
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch(`${API_ENDPOINT}/api/analyze`, { method: 'POST', body: formData });
            const data = await response.json();

            if (data.status === 'success' && data.submissionId) {
                onUploadSuccess(data.submissionId);
            } else {
                throw new Error(data.message || "An unknown error occurred.");
            }
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto max-w-2xl p-8 pt-20 bg-[#162447] rounded-2xl shadow-lg relative">
                <h1 className="text-3xl font-bold text-white text-center mb-6">{uiText.title}</h1>
                <form id="cv-form" onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="keywords" className="block text-lg font-semibold mb-2 text-slate-300">{uiText.keywordsLabel}</label>
                        <input type="text" id="keywords" name="keywords" placeholder={uiText.keywordsPlaceholder} className="w-full p-3 bg-[#2a3b5c] border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="cv-upload" className="block text-lg font-semibold mb-2 text-slate-300">{uiText.uploadLabel}</label>
                        <label htmlFor="cv-upload" className="flex flex-col items-center justify-center w-full min-h-[150px] border-2 border-dashed border-slate-600 rounded-lg bg-[#1f2a51] text-center p-4 cursor-pointer hover:border-sky-500">
                            <p className="text-slate-400">{files && files.length > 0 ? `${files.length} ${uiText.filesSelected}` : uiText.uploadPlaceholder}</p>
                            <input type="file" id="cv-upload" name="files" className="hidden" accept=".pdf,.doc,.docx,.jpg,.png" multiple onChange={handleFileChange} />
                        </label>
                    </div>
                    {error && <p className="text-rose-400 text-center mb-4">{error}</p>}
                    <button type="submit" disabled={isSubmitting} className="w-full p-3 text-lg font-bold bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed">
                        {isSubmitting ? uiText.submittingButton : uiText.submitButton}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

const Dashboard: React.FC<{ submissionId: number; onReset: () => void; }> = ({ submissionId, onReset }) => {
    const [data, setData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const pollIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        const POLLING_INTERVAL = 5000;
        const POLLING_TIMEOUT = 90000;

        const pollData = async () => {
            try {
                const response = await fetch(`${API_ENDPOINT}/api/results/${submissionId}`);
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                const result = await response.json();
                if (result.status === 'success') {
                    setData(result);
                    setLoading(false);
                    if(pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                }
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching results.");
                setLoading(false);
                if(pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            }
        };

        pollData();
        pollIntervalRef.current = window.setInterval(pollData, POLLING_INTERVAL);

        const timeoutId = window.setTimeout(() => {
            if (loading) {
                setError("Analysis is taking longer than expected. Please try again later.");
                setLoading(false);
                if(pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            }
        }, POLLING_TIMEOUT);

        return () => {
            if(pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            clearTimeout(timeoutId);
        };
    }, [submissionId, loading]);

    const categorizedResults = useMemo<CategorizedResults>(() => {
        const initial: CategorizedResults = { Excellent: [], 'Very Good': [], Good: [], Unsuitable: [] };
        if (!data) return initial;
        return data.results.reduce((acc, result) => {
            const category = getCategory(result.matchPercentage);
            acc[category].push(result);
            return acc;
        }, initial);
    }, [data]);

    if (loading) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center text-white">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                    <FileTextIcon className="text-5xl text-sky-400" />
                </motion.div>
                <p className="mt-4 text-lg font-semibold">Processing CVs...</p>
                <p className="text-slate-400">The dashboard will appear automatically when ready.</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center text-white text-center p-4">
                <XCircleIcon className="text-5xl text-rose-500" />
                <p className="mt-4 text-lg font-semibold">An Error Occurred</p>
                <p className="text-slate-400 max-w-md">{error}</p>
                <button onClick={onReset} className="mt-6 bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors">
                    Upload New CVs
                </button>
            </div>
        );
     }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Tooltip id="filename-tooltip" />
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">CV Analysis Dashboard</h1>
                        <p className="text-slate-400 mt-1">Showing results for <span className="font-semibold text-sky-400">{data?.totalCVs}</span> CVs analyzed.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-emerald-600">
                        <DownloadIcon /> Export to CSV
                    </button>
                </header>
                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-slate-300 mb-2">Analysis Keywords</h2>
                    <div className="flex flex-wrap gap-2">
                        {data?.analysisKeywords.map(keyword => (<span key={keyword} className="bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1 rounded-full">{keyword}</span>))}
                    </div>
                </div>
                <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
                    {(Object.keys(categorizedResults) as Category[]).map(category => (
                        <CategoryColumn key={category} category={category} results={categorizedResults[category]} totalCVs={data?.totalCVs || 0} />
                    ))}
                </main>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [submissionId, setSubmissionId] = useState<number | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isArabic, setIsArabic] = useState(false);

    const handleUploadSuccess = (id: number) => {
        setSubmissionId(id);
    };
    
    const handleReset = () => {
        setSubmissionId(null);
    }

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);
    const toggleLanguage = () => setIsArabic(prev => !prev);

    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-mode' : '';
        document.documentElement.lang = isArabic ? 'ar' : 'en';
        document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    }, [isDarkMode, isArabic]);

    return (
        <div className={`w-full min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={submissionId ? 'dashboard' : 'uploader'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {!submissionId ? (
                        <>
                            <Toggles isDarkMode={isDarkMode} isArabic={isArabic} toggleDarkMode={toggleDarkMode} toggleLanguage={toggleLanguage} />
                            <Uploader onUploadSuccess={handleUploadSuccess} isArabic={isArabic} />
                        </>
                    ) : (
                        <Dashboard submissionId={submissionId} onReset={handleReset} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default App;
