import { useState } from 'react';
import {
  AlertCircle,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { OptionKey, Question } from '../data/questions';
import { formatTime } from './ExamWorkspace';
import { MathText } from './MathText';
import { StudentInfo } from './StartScreen';

type ResultFilter = 'all' | 'correct' | 'incorrect';

interface ResultViewProps {
  student: StudentInfo;
  questions: Question[];
  answers: Record<number, OptionKey>;
  elapsedSeconds: number;
  timedOut: boolean;
  onRetry: () => void;
}

export function ResultView({
  student,
  questions,
  answers,
  elapsedSeconds,
  timedOut,
  onRetry,
}: ResultViewProps) {
  const [filter, setFilter] = useState<ResultFilter>('all');

  const correctCount = questions.filter((q) => answers[q.id] === q.correctKey).length;
  const incorrectOrBlankCount = questions.length - correctCount;
  const score = ((correctCount / questions.length) * 10).toFixed(2);

  const getFeedbackMessage = (numericScore: number) => {
    if (numericScore >= 8.5) return 'Xuất sắc! Bạn đã nắm rất vững kiến thức về Mệnh đề.';
    if (numericScore >= 6.5) return 'Khá tốt! Hãy rà soát lại những câu chưa chính xác bên dưới.';
    if (numericScore >= 5) return 'Đạt yêu cầu. Bạn nên đọc kĩ lời giải chi tiết để củng cố phần kí hiệu và mệnh đề kéo theo.';
    return 'Cần ôn tập thêm. Hãy xem kĩ từng lời giải chi tiết bên dưới rồi làm lại bài nhé.';
  };

  const filteredQuestions = questions
    .map((question, originalIndex) => ({ question, originalIndex }))
    .filter(({ question }) => {
      const isCorrect = answers[question.id] === question.correctKey;
      if (filter === 'correct') return isCorrect;
      if (filter === 'incorrect') return !isCorrect;
      return true;
    });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          <span className="text-sm sm:text-base font-bold tracking-tight text-blue-800 truncate">
            KẾT QUẢ KIỂM TRA 15 PHÚT - ĐẠI SỐ 10
          </span>
          <button
            type="button"
            onClick={onRetry}
            className="h-10 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại bài</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
          {timedOut && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Đã hết thời gian 15 phút. Hệ thống đã tự động nộp bài làm của bạn.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 bg-blue-50/70 border border-blue-200 rounded-xl p-6 text-center">
              <p className="text-xs font-semibold text-blue-800">Điểm số (thang điểm 10)</p>
              <p className="mt-2 text-4xl sm:text-5xl font-bold font-mono text-blue-800 tabular-nums">
                {score}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700 tabular-nums">
                Đúng {correctCount}/{questions.length} câu
              </p>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span>
                    Học sinh: <strong className="font-semibold text-slate-900">{student.fullName}</strong>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>
                    Lớp: <strong className="font-semibold text-slate-900">{student.className}</strong>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="tabular-nums">
                    Thời gian: <strong className="font-semibold text-slate-900 font-mono">{formatTime(elapsedSeconds)}</strong>
                  </span>
                </div>
                <h1 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900 [text-wrap:balance]">
                  {getFeedbackMessage(Number(score))}
                </h1>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onRetry}
                  className="h-10 px-5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại bài (xáo trộn câu hỏi)</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900">
              Đáp án và lời giải chi tiết
            </h2>

            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg" role="tablist" aria-label="Lọc câu hỏi theo kết quả">
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'all'}
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả ({questions.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'correct'}
                onClick={() => setFilter('correct')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'correct' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Làm đúng ({correctCount})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'incorrect'}
                onClick={() => setFilter('incorrect')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'incorrect' ? 'bg-white text-red-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chưa đúng ({incorrectOrBlankCount})
              </button>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-600">
              Không có câu hỏi nào trong mục lọc này.
            </div>
          ) : (
            <div className="space-y-5">
              {filteredQuestions.map(({ question, originalIndex }) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctKey;
                const isUnanswered = !userAnswer;

                return (
                  <article
                    key={question.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2.5 text-sm">
                        <span className="font-bold text-slate-900 tabular-nums">
                          Câu {originalIndex + 1}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-500">{question.topic}</span>
                      </div>

                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Trả lời đúng (+1,67 điểm)</span>
                        </span>
                      ) : isUnanswered ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                          <AlertCircle className="w-4 h-4" />
                          <span>Chưa chọn đáp án (0 điểm)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700">
                          <XCircle className="w-4 h-4" />
                          <span>Trả lời sai (0 điểm)</span>
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-base font-medium text-slate-900 leading-relaxed">
                      <MathText text={question.prompt} />
                    </h3>

                    <div className="mt-4 space-y-2.5">
                      {question.options.map((option) => {
                        const isThisCorrect = option.key === question.correctKey;
                        const isThisUserChoice = option.key === userAnswer;
                        const isWrongSelection = isThisUserChoice && !isThisCorrect;

                        let containerClass = 'bg-white border-slate-200 text-slate-700';
                        let letterClass = 'bg-slate-100 text-slate-700 border border-slate-200';

                        if (isThisCorrect) {
                          containerClass = 'bg-emerald-50 border-emerald-500 text-emerald-950';
                          letterClass = 'bg-emerald-600 text-white';
                        } else if (isWrongSelection) {
                          containerClass = 'bg-red-50 border-red-400 text-red-950';
                          letterClass = 'bg-red-600 text-white';
                        }

                        return (
                          <div
                            key={option.key}
                            className={`px-4 py-3 rounded-lg border flex flex-wrap sm:flex-nowrap items-start justify-between gap-3 ${containerClass}`}
                          >
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <span
                                className={`w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${letterClass}`}
                              >
                                {option.key}
                              </span>
                              <span className="text-[15px] leading-relaxed">
                                <MathText text={option.text} />
                              </span>
                            </div>

                            {isThisCorrect && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 shrink-0 mt-1 whitespace-nowrap">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{isThisUserChoice ? 'Bạn chọn đúng' : 'Đáp án đúng'}</span>
                              </span>
                            )}

                            {isWrongSelection && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-800 shrink-0 mt-1 whitespace-nowrap">
                                <XCircle className="w-4 h-4" />
                                <span>Bạn chọn sai</span>
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-800 mb-1.5">
                        <BookOpenCheck className="w-4 h-4" />
                        <span>Lời giải chi tiết</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        <MathText text={question.explanation} />
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
