import { FormEvent, useState } from 'react';
import { ArrowRight, BookOpen, Clock, CheckSquare, Award } from 'lucide-react';

export interface StudentInfo {
  fullName: string;
  className: string;
}

interface StartScreenProps {
  initialStudent: StudentInfo;
  questionCount: number;
  durationMinutes: number;
  onStart: (student: StudentInfo) => void;
}

export function StartScreen({
  initialStudent,
  questionCount,
  durationMinutes,
  onStart,
}: StartScreenProps) {
  const [fullName, setFullName] = useState(initialStudent.fullName);
  const [className, setClassName] = useState(initialStudent.className);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim();
    const trimmedClass = className.trim();

    if (!trimmedName || !trimmedClass) {
      setError('Vui lòng nhập đầy đủ Họ và tên và Lớp trước khi bắt đầu làm bài.');
      return;
    }

    setError('');
    onStart({ fullName: trimmedName, className: trimmedClass });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <span className="text-base sm:text-lg font-bold tracking-tight text-blue-800 whitespace-nowrap shrink-0">
            TOÁN HỌC THPT
          </span>
          <div className="hidden sm:flex items-center gap-2.5 text-sm text-slate-600 whitespace-nowrap">
            <span>GDPT 2018</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Bộ sách Kết nối tri thức</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-blue-700 mb-3">
                <span>Đại số 10</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Chương 1 - Bài 1: Mệnh đề</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
                KIỂM TRA 15 PHÚT - ĐẠI SỐ 10
              </h1>

              <p className="mt-3 text-slate-600 text-[15px] leading-relaxed">
                Bài kiểm tra đánh giá kiến thức trọng tâm về mệnh đề, mệnh đề chứa biến, mệnh đề phủ định, mệnh đề kéo theo, mệnh đề đảo, mệnh đề tương đương và điều kiện cần, điều kiện đủ.
              </p>

              <div className="mt-7 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 sm:gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Số lượng</p>
                    <p className="text-sm font-semibold text-slate-900 tabular-nums">
                      {questionCount} câu trắc nghiệm
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Thời gian làm bài</p>
                    <p className="text-sm font-semibold text-slate-900 tabular-nums">
                      {durationMinutes} phút (tự động nộp)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Thang điểm</p>
                    <p className="text-sm font-semibold text-slate-900 tabular-nums">
                      10 điểm (1,67 điểm/câu)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Sau khi nộp bài</p>
                    <p className="text-sm font-semibold text-slate-900">
                      Chấm điểm &amp; xem lời giải
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 pt-5 border-t border-slate-100 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Lưu ý: Mỗi câu hỏi có 4 phương án A, B, C, D và chỉ có 1 đáp án đúng. Đồng hồ bắt đầu đếm ngược ngay khi bạn bấm bắt đầu.
            </div>
          </section>

          <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-slate-900">Thông tin học sinh</h2>
            <p className="mt-1 text-sm text-slate-500">
              Điền thông tin để ghi nhận vào phiếu kết quả bài làm.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label
                  htmlFor="student-fullname"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Họ và tên <span className="text-red-600">*</span>
                </label>
                <input
                  id="student-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Ví dụ: Nguyễn Minh Anh"
                  autoComplete="name"
                  className="w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="student-class"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Lớp <span className="text-red-600">*</span>
                </label>
                <input
                  id="student-class"
                  type="text"
                  value={className}
                  onChange={(e) => {
                    setClassName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Ví dụ: 10A1"
                  className="w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full mt-2 h-11 px-5 rounded-lg bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 cursor-pointer whitespace-nowrap"
              >
                <span>Bắt đầu làm bài</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
