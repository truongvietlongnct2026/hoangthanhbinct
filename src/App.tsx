import { useCallback, useEffect, useState } from 'react';
import {
  EXAM_DURATION_SECONDS,
  INITIAL_QUESTIONS,
  OptionKey,
  Question,
  shuffleQuestions,
} from './data/questions';
import { ExamWorkspace } from './components/ExamWorkspace';
import { ResultView } from './components/ResultView';
import { StartScreen, StudentInfo } from './components/StartScreen';

type ExamPhase = 'start' | 'active' | 'result';

export default function App() {
  const [phase, setPhase] = useState<ExamPhase>('start');
  const [student, setStudent] = useState<StudentInfo>({
    fullName: '',
    className: '',
  });
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [answers, setAnswers] = useState<Record<number, OptionKey>>({});
  const [remainingSeconds, setRemainingSeconds] = useState<number>(EXAM_DURATION_SECONDS);
  const [timedOut, setTimedOut] = useState<boolean>(false);

  const submitExam = useCallback((isTimeout: boolean) => {
    setTimedOut(isTimeout);
    setPhase('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (phase !== 'active') return;

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          submitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, submitExam]);

  const handleStartExam = (info: StudentInfo) => {
    setStudent(info);
    setQuestions(INITIAL_QUESTIONS);
    setAnswers({});
    setRemainingSeconds(EXAM_DURATION_SECONDS);
    setTimedOut(false);
    setPhase('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnswer = (questionId: number, option: OptionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleRetryExam = () => {
    setQuestions((prev) => {
      let shuffled = shuffleQuestions(prev);
      // Guarantee visible reorder when shuffling 6 items
      if (shuffled.every((q, idx) => q.id === prev[idx].id) && shuffled.length > 1) {
        shuffled = [...shuffled.slice(1), shuffled[0]];
      }
      return shuffled;
    });
    setAnswers({});
    setRemainingSeconds(EXAM_DURATION_SECONDS);
    setTimedOut(false);
    setPhase('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (phase === 'start') {
    return (
      <StartScreen
        initialStudent={student}
        questionCount={INITIAL_QUESTIONS.length}
        durationMinutes={EXAM_DURATION_SECONDS / 60}
        onStart={handleStartExam}
      />
    );
  }

  if (phase === 'active') {
    return (
      <ExamWorkspace
        student={student}
        questions={questions}
        answers={answers}
        remainingSeconds={remainingSeconds}
        onSelectAnswer={handleSelectAnswer}
        onSubmitExam={() => submitExam(false)}
      />
    );
  }

  const elapsedSeconds = EXAM_DURATION_SECONDS - remainingSeconds;

  return (
    <ResultView
      student={student}
      questions={questions}
      answers={answers}
      elapsedSeconds={elapsedSeconds}
      timedOut={timedOut}
      onRetry={handleRetryExam}
    />
  );
}
