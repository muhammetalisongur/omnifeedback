import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { AdapterProvider } from './components/AdapterProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { HomePage } from './pages/HomePage';
import { ToastPage } from './pages/ToastPage';
import { ModalPage } from './pages/ModalPage';
import { LoadingPage } from './pages/LoadingPage';
import { ConfirmPage } from './pages/ConfirmPage';
import { ProgressPage } from './pages/ProgressPage';
import { DrawerPage } from './pages/DrawerPage';
import { SheetPage } from './pages/SheetPage';
import { BannerPage } from './pages/BannerPage';
import { PromptPage } from './pages/PromptPage';
import { AlertPage } from './pages/AlertPage';
import { PopconfirmPage } from './pages/PopconfirmPage';
import { SkeletonPage } from './pages/SkeletonPage';
import { EmptyPage } from './pages/EmptyPage';
import { ResultPage } from './pages/ResultPage';
import { ConnectionPage } from './pages/ConnectionPage';
import { usePlaygroundStore } from './stores/playground-store';

export type AdapterName = 'headless' | 'shadcn' | 'mantine' | 'chakra' | 'mui' | 'antd';

export default function App(): React.ReactElement {
  const adapterType = usePlaygroundStore((s) => s.adapterType);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-muted rounded-md lg:hidden"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">
              <span className="text-primary">Omni</span>Feedback
            </h1>
            <span className="hidden sm:inline text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Demo
            </span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto p-6 max-w-5xl">
            <AdapterProvider adapter={adapterType}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/toast" element={<ToastPage />} />
                <Route path="/modal" element={<ModalPage />} />
                <Route path="/loading" element={<LoadingPage />} />
                <Route path="/confirm" element={<ConfirmPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/drawer" element={<DrawerPage />} />
                <Route path="/sheet" element={<SheetPage />} />
                <Route path="/banner" element={<BannerPage />} />
                <Route path="/prompt" element={<PromptPage />} />
                <Route path="/alert" element={<AlertPage />} />
                <Route path="/popconfirm" element={<PopconfirmPage />} />
                <Route path="/skeleton" element={<SkeletonPage />} />
                <Route path="/empty" element={<EmptyPage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/connection" element={<ConnectionPage />} />
              </Routes>
            </AdapterProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
