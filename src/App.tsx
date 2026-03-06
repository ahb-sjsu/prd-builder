import { useState, useCallback } from 'react';
import { useSettings } from './settings/useSettings';
import { useSessions } from './hooks/useSessions';
import { Header } from './components/layout/Header';
import { SettingsPanel } from './components/layout/SettingsPanel';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { PrdWizard } from './pages/PrdWizard';
import { PrdView } from './pages/PrdView';
import type { RoleId } from './types/session';

export type AppScreen =
  | { page: 'landing' }
  | { page: 'dashboard' }
  | { page: 'wizard'; step: WizardStep; role?: RoleId }
  | { page: 'prd' };

export type WizardStep =
  | 'compliance'
  | 'roles'
  | 'questions'
  | 'done'
  | 'generating';

export function App() {
  const { settings } = useSettings();
  const sessionManager = useSessions();
  const [screen, setScreen] = useState<AppScreen>({ page: 'landing' });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [progressInfo, setProgressInfo] = useState<{
    section: string;
    pct: number;
  } | null>(null);

  const goHome = useCallback(() => {
    setScreen({ page: 'landing' });
    setProgressInfo(null);
  }, []);

  const goToDashboard = useCallback(() => {
    setScreen({ page: 'dashboard' });
    setProgressInfo(null);
  }, []);

  const startNewPrd = useCallback(() => {
    sessionManager.createSession();
    setScreen({ page: 'wizard', step: 'compliance' });
  }, [sessionManager]);

  const joinSession = useCallback(
    (code: string): boolean => {
      const found = sessionManager.findByCode(code.toUpperCase());
      if (!found) return false;
      sessionManager.setActiveSession(found);
      setScreen({ page: 'wizard', step: 'roles' });
      return true;
    },
    [sessionManager],
  );

  const openExistingSession = useCallback(
    (id: string) => {
      sessionManager.openSession(id);
      const session = sessionManager.sessions.find((s) => s.id === id);
      if (session?.prdMarkdown) {
        setScreen({ page: 'prd' });
      } else {
        setScreen({ page: 'wizard', step: 'roles' });
      }
    },
    [sessionManager],
  );

  const showPrd = useCallback(() => {
    setScreen({ page: 'prd' });
    setProgressInfo(null);
  }, []);

  return (
    <>
      <Header
        platname={settings.platname}
        company={settings.company}
        brandColor={settings.brandColor}
        session={sessionManager.activeSession}
        progressInfo={progressInfo}
        onLogoClick={goHome}
        onSettingsClick={() => setSettingsOpen(true)}
        onSwitchRole={
          screen.page === 'wizard' && screen.step === 'questions'
            ? () => setScreen({ page: 'wizard', step: 'roles' })
            : undefined
        }
        showDashboard={goToDashboard}
      />

      <div className="main">
        {screen.page === 'landing' && (
          <LandingPage
            onStartNew={startNewPrd}
            onJoinSession={joinSession}
            onGoToDashboard={goToDashboard}
            hasSessions={sessionManager.sessions.length > 0}
          />
        )}

        {screen.page === 'dashboard' && (
          <Dashboard
            sessions={sessionManager.sessions}
            onStartNew={startNewPrd}
            onOpen={openExistingSession}
            onDelete={sessionManager.deleteSession}
          />
        )}

        {screen.page === 'wizard' && sessionManager.activeSession && (
          <PrdWizard
            session={sessionManager.activeSession}
            step={screen.step}
            role={screen.page === 'wizard' ? screen.role : undefined}
            onStepChange={(step, role) =>
              setScreen({ page: 'wizard', step, role })
            }
            onSaveContribution={sessionManager.saveContribution}
            onUpdateSession={sessionManager.updateSession}
            onProgressChange={setProgressInfo}
            onShowPrd={showPrd}
            onGoBack={() => {
              if (screen.step === 'compliance') goHome();
              else if (screen.step === 'roles')
                setScreen({ page: 'wizard', step: 'compliance' });
              else if (screen.step === 'questions')
                setScreen({ page: 'wizard', step: 'roles' });
              else if (screen.step === 'done')
                setScreen({ page: 'wizard', step: 'roles' });
            }}
          />
        )}

        {screen.page === 'prd' && sessionManager.activeSession && (
          <PrdView
            session={sessionManager.activeSession}
            onUpdateSession={sessionManager.updateSession}
            onAddContributor={() =>
              setScreen({ page: 'wizard', step: 'roles' })
            }
            onStartNew={() => {
              sessionManager.setActiveSession(null);
              goHome();
            }}
            onRegenerate={() =>
              setScreen({ page: 'wizard', step: 'generating' })
            }
          />
        )}
      </div>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
