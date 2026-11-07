import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#EAF3ED] text-[#203C37] flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area (Offset by 64px on lg screens) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        {/* Top Header */}
        <Header onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Dynamic Page Views */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* Toast Feedback */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#245B4B',
            color: '#fff',
            fontSize: '12px',
            borderRadius: '10px',
            border: '1px solid #368F83'
          }
        }}
      />
    </div>
  );
};

export default Layout;
