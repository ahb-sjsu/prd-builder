import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PlanProvider } from './plan/PlanContext';
import { SettingsProvider } from './settings/SettingsContext';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlanProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </PlanProvider>
  </StrictMode>,
);
