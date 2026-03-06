import { useState, useEffect, useCallback, useRef } from 'react';
import { ComplianceScreener } from '../components/wizard/ComplianceScreener';
import { RolePicker } from '../components/wizard/RolePicker';
import { QuestionFlow } from '../components/wizard/QuestionFlow';
import { SectionDone } from '../components/wizard/SectionDone';
import { GeneratingScreen } from '../components/wizard/GeneratingScreen';
import { useSettings } from '../settings/useSettings';
import { usePlan } from '../plan/usePlan';
import { generateWithAI, generateTemplate } from '../helpers/prdGenerator';
import type { PrdSession, RoleId } from '../types/session';
import type { WizardStep } from '../App';

interface Props {
  session: PrdSession;
  step: WizardStep;
  role?: RoleId;
  onStepChange: (step: WizardStep, role?: RoleId) => void;
  onSaveContribution: (
    sessionId: string,
    role: RoleId,
    answers: Record<string, string | string[]>,
  ) => void;
  onUpdateSession: (id: string, updates: Partial<PrdSession>) => void;
  onProgressChange: (info: { section: string; pct: number } | null) => void;
  onShowPrd: () => void;
  onGoBack: () => void;
}

export function PrdWizard({
  session,
  step,
  role,
  onStepChange,
  onSaveContribution,
  onUpdateSession,
  onProgressChange,
  onShowPrd,
  onGoBack,
}: Props) {
  const { settings } = useSettings();
  const { tier, canUseFeature } = usePlan();
  const [screenerAnswers, setScreenerAnswers] = useState<
    Record<string, string>
  >(session.complianceData.answers);
  const [detectedFrameworks, setDetectedFrameworks] = useState<string[]>(
    session.complianceData.frameworks,
  );
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(
    role || null,
  );
  const [genError, setGenError] = useState<string | null>(null);
  const genAttempted = useRef(false);

  // Sync screener data to session
  useEffect(() => {
    onUpdateSession(session.id, {
      complianceData: {
        answers: screenerAnswers,
        frameworks: detectedFrameworks,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenerAnswers, detectedFrameworks]);

  const handleGenerate = useCallback(async () => {
    if (genAttempted.current) return;
    genAttempted.current = true;
    onStepChange('generating');
    setGenError(null);

    try {
      let md: string;
      if (canUseFeature('aiGeneration') && settings.apiKey) {
        md = await generateWithAI(session, settings.apiKey);
      } else {
        // Small delay for UX
        await new Promise((r) => setTimeout(r, 1500));
        md = generateTemplate(session);
      }
      onUpdateSession(session.id, { prdMarkdown: md });
      onShowPrd();
    } catch (err) {
      setGenError(
        err instanceof Error ? err.message : 'Generation failed. Please try again.',
      );
      onStepChange('done');
    } finally {
      genAttempted.current = false;
    }
  }, [session, settings.apiKey, canUseFeature, onUpdateSession, onShowPrd, onStepChange]);

  // Auto-start generation when step is 'generating'
  useEffect(() => {
    if (step === 'generating' && !genAttempted.current) {
      handleGenerate();
    }
  }, [step, handleGenerate]);

  if (step === 'compliance') {
    return (
      <ComplianceScreener
        answers={screenerAnswers}
        detectedFrameworks={detectedFrameworks}
        defaultCompliance={settings.defaultCompliance}
        onAnswer={(answers, frameworks) => {
          setScreenerAnswers(answers);
          setDetectedFrameworks(frameworks);
        }}
        onContinue={() => onStepChange('roles')}
        onBack={onGoBack}
      />
    );
  }

  if (step === 'roles') {
    return (
      <RolePicker
        session={session}
        selectedRole={selectedRole}
        roleNames={settings.roleNames}
        onSelectRole={setSelectedRole}
        onStart={() => {
          if (selectedRole) onStepChange('questions', selectedRole);
        }}
        onGenerate={handleGenerate}
        onBack={onGoBack}
      />
    );
  }

  if (step === 'questions' && selectedRole) {
    return (
      <QuestionFlow
        session={session}
        role={selectedRole}
        roleNames={settings.roleNames}
        customQuestions={settings.customQuestions}
        detectedFrameworks={detectedFrameworks}
        onSave={(answers) => {
          onSaveContribution(session.id, selectedRole, answers);
          onStepChange('done');
        }}
        onProgressChange={onProgressChange}
        onBack={() => onStepChange('roles')}
      />
    );
  }

  if (step === 'done') {
    return (
      <SectionDone
        session={session}
        completedRole={selectedRole}
        genError={genError}
        tier={tier}
        hasApiKey={!!settings.apiKey}
        onAddRole={() => onStepChange('roles')}
        onGenerate={handleGenerate}
      />
    );
  }

  if (step === 'generating') {
    return <GeneratingScreen />;
  }

  return null;
}
