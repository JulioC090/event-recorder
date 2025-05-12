import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { ConfigProvider } from './contexts/ConfigProvider.tsx';
import { EventRecorderProvider } from './contexts/EventRecorderProvider.tsx';
import './index.css';
import Home from './pages/Home.tsx';
import Recorder from './pages/Recorder.tsx';
import Test from './pages/Test.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/recorder/:url"
            element={
              <EventRecorderProvider>
                <Recorder />
              </EventRecorderProvider>
            }
          />

          {import.meta.env.MODE === 'development' && (
            <Route path="/test" element={<Test />} />
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
);
