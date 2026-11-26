import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  LayoutList,
  Send,
  SquareStack,
} from 'lucide-react';
import { OptionKey, Question } from '../data/questions';
import { MathText } from './MathText';
import { StudentInfo } from './StartScreen';

type ViewMode = 'single' | 'all';

interface ExamWorkspaceProps {
  student: StudentInfo;
  questions: Question[];
  answers: Record<number, OptionKey>;
  remainingSeconds: number;
  onSelectAnswer: (questionId: number, option: OptionKey) => void;
  onSubmitExam: () => void;
}

export function formatTime(seconds: number): string {
  const safe = Math.max(0, seconds);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function ExamWorkspace({
  student,
  questions,
  answers,
  remainingSeconds,
  onSelectAnswer,
  onSubmitExam,
}: ExamWorkspaceProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const answeredCount = questions.filter((q) => Boolean(answers[q.id])).length;
  const unansweredIndices = questions
    .map((q, idx) => (!answers[q.id] ? idx + 1 : null))
    .filter((n): n is number => n !== null);
  const isTimeLow = remainingSeconds <= 120;

  useEffect(() => {
    if (!showConfirmModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowConfirmModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConfirmModal]);

  const handleNavigatorClick = (index: number) => {
    setActiveIndex(index);
    if (viewMode === 'all') {
      const target = document.getElementById(`question-card-${questions[index].id}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderQuestionCard = (question: Question, index: number) => {
    const selected = answers[question.id];

    return (
      <article
        key={question.id}
        id={`question-card-${question.id}`}
        className="scroll-mt-24 bg-white border border-slate-200 rounded-xl p-5 sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="font-bold text-blue-800 tabular-nums">
              Câu {index + 1} / {questions.length}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500">{question.topic}</span>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Mức độ: {question.level}
          </span>
        </div>

        <h2 className="mt-5 text-base sm:text-[17px] font-medium text-slate-900 leading-relaxed">
          <MathText text={question.prompt} />
        </h2>

        <div className="mt-5 space-y-3" role="radiogroup" aria-label={`Các phương án cho Câu ${index + 1}`}>
          {question.options.map((option) => {
            const isSelected = selected === option.key;
            return (
              <button
                key={option.key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectAnswer(question.id, option.key)}
                className={`w-full text-left min-h-[52px] px-4 py-3.5 rounded-lg border transition-colors duration-150 flex items-start gap-3.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-600 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {option.key}
                </span>
                <span className="text-[15px] leading-relaxed flex-1">
                  <MathText text={option.text} />
                </span>
              </button>
            );
          })}
        </div>
      </article>
    );
  };

  const currentQuestion = questions[activeIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
          <div className="min-w-0 flex items-center gap-3">
            <span className="text-sm sm:text-base font-bold tracking-tight text-blue-800 truncate">
              KIỂM TRA 15 PHÚT - ĐẠI SỐ 10
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-mono font-semibold tabular-nums transition-colors ${
                isTimeLow
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-slate-100 border-slate-200 text-slate-900'
              }`}
              aria-live="polite"
              aria-label={`Thời gian còn lại ${formatTime(remainingSeconds)}`}
            >
              <Clock className={`w-4 h-4 shrink-0 ${isTimeLow ? 'text-amber-700' : 'text-blue-700'}`} />
              <span>{formatTime(remainingSeconds)}</span>
              {isTimeLow && (
                <span className="hidden md:inline font-sans text-xs font-medium text-amber-800">
                  Sắp hết giờ
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="h-9 sm:h-10 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nộp bài</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 bg-white border border-slate-200 rounded-xl px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-700">
            <span>
              Học sinh: <strong className="font-semibold text-slate-900">{student.fullName}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              Lớp: <strong className="font-semibold text-slate-900">{student.className}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-600">Chương 1 - Bài 1: Mệnh đề</span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg" role="group" aria-label="Chế độ hiển thị câu hỏi">
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SquareStack className="w-3.5 h-3.5" />
              <span>Từng câu</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Tất cả ({questions.length})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-8 space-y-5">
            {viewMode === 'single' ? (
              <>
                {renderQuestionCard(currentQuestion, activeIndex)}

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    disabled={activeIndex === 0}
                    onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                    className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-45 disabled:pointer-events-none text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Câu trước</span>
                  </button>

                  {activeIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setActiveIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="h-10 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span>Câu tiếp theo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowConfirmModal(true)}
                      className="h-10 px-5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Hoàn thành &amp; Nộp bài</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              questions.map((question, idx) => renderQuestionCard(question, idx))
            )}
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Bảng điều hướng câu hỏi</h3>
              <span className="text-xs font-mono font-semibold text-blue-700 tabular-nums">
                {answeredCount}/{questions.length} đã làm
              </span>
            </div>

            <div className="mt-4 grid grid-cols-6 lg:grid-cols-3 gap-2.5">
              {questions.map((q, idx) => {
                const chosen = answers[q.id];
                const isCurrent = viewMode === 'single' && idx === activeIndex;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleNavigatorClick(idx)}
                    aria-label={`Chuyển đến câu ${idx + 1}${chosen ? `, đã chọn đáp án ${chosen}` : ', chưa làm'}`}
                    className={`h-11 rounded-lg border text-sm font-semibold tabular-nums flex items-center justify-center gap-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      isCurrent
                        ? 'border-blue-700 ring-2 ring-blue-600/20 bg-blue-50 text-blue-800'
                        : chosen
                        ? 'bg-blue-700 border-blue-700 text-white hover:bg-blue-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {chosen && (
                      <span className="text-[11px] font-mono opacity-90">({chosen})</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded bg-blue-700 inline-block shrink-0" />
                <span>Đã chọn đáp án ({answeredCount} câu)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded bg-white border border-slate-300 inline-block shrink-0" />
                <span>Chưa làm ({questions.length - answeredCount} câu)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="mt-5 w-full h-11 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Nộp bài kiểm tra</span>
            </button>
          </aside>
        </div>
      </main>

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={() => setShowConfirmModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-dialog-title"
        >
          <div
            className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="submit-dialog-title" className="text-lg font-bold text-slate-900">
              Xác nhận nộp bài
            </h2>

            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Bạn đã hoàn thành <strong className="text-slate-900 tabular-nums">{answeredCount}/{questions.length}</strong> câu hỏi và còn{' '}
              <strong className="font-mono text-slate-900 tabular-nums">{formatTime(remainingSeconds)}</strong>.
            </p>

            {unansweredIndices.length > 0 ? (
              <div className="mt-4 p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900 leading-relaxed">
                  <p className="font-semibold">
                    Cảnh báo: Còn {unansweredIndices.length} câu chưa chọn đáp án
                  </p>
                  <p className="mt-0.5 text-amber-800">
                    Các câu chưa làm: Câu {unansweredIndices.join(', Câu ')}. Các câu bỏ trống sẽ tính 0 điểm.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-900 leading-relaxed">
                  Bạn đã trả lời đầy đủ tất cả {questions.length} câu hỏi. Sẵn sàng nộp bài để xem điểm và lời giải chi tiết.
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="h-10 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
              >
                Quay lại làm tiếp
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  onSubmitExam();
                }}
                className="h-10 px-5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                Xác nhận nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
