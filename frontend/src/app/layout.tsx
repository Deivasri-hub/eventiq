import React from 'react';
import './globals.css';
import { AuthProvider } from '../lib/AuthContext';
import { Navbar } from '../components/Navbar';

export const metadata = {
  title: 'ACE Intelligence | AllCollegeEvent AI Recommendation Platform',
  description: 'AI-Powered Event Intelligence and Personalized Recommendation Engine for AllCollegeEvent students.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-white border-t border-purple-100 py-8 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">ACE Intelligence</span>
                <span>— AllCollegeEvent AI Recommendation Engine.</span>
              </div>
              <div className="flex items-center gap-4 text-purple-600 font-medium">
                <span>Student Hub</span>
                <span>•</span>
                <span>Explainable AI</span>
                <span>•</span>
                <span>Similar Student Proof</span>
                <span>•</span>
                <span>Organizer Studio</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
