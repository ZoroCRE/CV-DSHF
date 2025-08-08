import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';

// KeywordManager and Uploader components go here...
// ... (The full code for these components)

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
                {/* <Uploader /> will go here */}
            </main>
        </div>
    );
};

export default DashboardPage;
