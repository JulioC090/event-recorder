import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import './index.css';
import Home from './pages/Home.tsx';
import Recorder from './pages/Recorder.tsx';
import Test from './pages/Test.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recorder/:url" element={<Recorder />} />

        {import.meta.env.MODE === 'development' && (
          <Route path="/test" element={<Test />} />
        )}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
