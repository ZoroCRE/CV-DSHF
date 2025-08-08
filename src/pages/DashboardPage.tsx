import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';

// KeywordManager Component
const KeywordManager: React.FC = () => {
    return (
        <div className="mt-12 p-6 bg-slate-800 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Keyword List Manager (Coming Soon)</h3>
            <p className="text-slate-400">This section will allow you to create, edit, and delete reusable keyword lists.</p>
        </div>
    );
};

// Uploader Component
const Uploader: React.FC = () => {
  const [keywordLists, setKeywordLists] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [manualKeywords, setManualKeywords] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  useEffect(() => {
    const fetchKeywordLists = async () => {
      const { data } = await supabase.from('keyword_lists').select('*');
      if (data) setKeywordLists(data);
    };
    fetchKeywordLists();
  }, []);

  const handleListSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const listId = e.target.value;
    setSelectedListId(listId);

    if (listId) {
      const selectedList = keywordLists.find(list => list.id.toString() === listId);
      if (selectedList) setManualKeywords(selectedList.keywords.join(', '));
    } else {
      setManualKeywords('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    if (files) {
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
    }

    try {
      // FIX: Use the 'data' variable to show the success message from the server
      const { data, error } = await supabase.functions.invoke('process-cv', { body: formData });
      if (error) throw error;
      alert("Success! " + data.message);
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Upload & Analyze CVs</h1>
        <form onSubmit={handleSubmit} className="p-8 bg-slate-800 rounded-lg">
            <div className="mb-6">
                <label htmlFor="keywords" className="block text-lg font-semibold mb-2 text-slate-300">Enter Keywords</label>
                <input 
                    type="text" 
                    id="keywords" 
                    name="keywords"
                    className="w-full p-3 bg-slate-700 rounded-lg text-white"
                    value={manualKeywords}
                    onChange={(e) => {
                        setManualKeywords(e.target.value);
                        setSelectedListId('');
                    }}
                    readOnly={!!selectedListId}
                />
            </div>
            <div className="my-4">
                <label htmlFor="keyword-list" className="block text-lg font-semibold mb-2 text-slate-300">Or Select a Saved List</label>
                <select id="keyword-list" value={selectedListId} onChange={handleListSelect} className="w-full p-3 bg-slate-700 rounded-lg text-white">
                    <option value="">None</option>
                    {keywordLists.map(list => (
                        <option key={list.id} value={list.id}>{list.list_name}</option>
                    ))}
                </select>
            </div>
            <div className="mb-6">
                <label htmlFor="cv-upload" className="block text-lg font-semibold mb-2 text-slate-300">Upload CVs</label>
                <input 
                    type="file" 
                    id="cv-upload" 
                    name="files" 
                    multiple 
                    onChange={(e) => setFiles(e.target.files)}
                    className="w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full p-3 text-lg font-bold bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-slate-500">
                {isSubmitting ? 'Analyzing...' : 'Analyze and Submit'}
            </button>
        </form>
        <KeywordManager />
    </div>
  );
};

const DashboardPage: React.FC<{ session: Session }> = ({ session }) => {
    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-8">
                <h2 className="text-2xl text-white">Welcome, {session.user.email}</h2>
                <button 
                    onClick={() => supabase.auth.signOut()}
                    className="bg-rose-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-rose-700"
                >
                    Sign Out
                </button>
            </header>
            <main>
                <Uploader />
            </main>
        </div>
    );
};

export default DashboardPage;
