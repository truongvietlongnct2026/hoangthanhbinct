export type OptionKey = 'A' | 'B' | 'C' | 'D';

export type CognitiveLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng';

export interface QuestionOption {
  key: OptionKey;
  text: string;
}

export interface Question {
  id: number;
  topic: string;
  level: CognitiveLevel;
  prompt: string;
  options: QuestionOption[];
  correctKey: OptionKey;
  explanation: string;
}

export const EXAM_DURATION_SECONDS = 15 * 60; // 15 phút = 900 giây

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    topic: 'Mệnh đề và mệnh đề chứa biến',
    level: 'Nhận biết',
    prompt: 'Trong các phát biểu sau, phát biểu nào là **mệnh đề chứa biến**?',
    options: [
      { key: 'A', text: '$2024$ là số tự nhiên chia hết cho $4$.' },
      { key: 'B', text: 'Phương trình $x^2 - 5x + 6 = 0$ có nghiệm thực không?' },
      { key: 'C', text: '$2n + 1$ là số nguyên tố với $n \\in \\mathbb{N}$.' },
      { key: 'D', text: '$\\pi$ là một số vô tỉ.' },
    ],
    correctKey: 'C',
    explanation:
      'Phát biểu "$2n + 1$ là số nguyên tố với $n \\in \\mathbb{N}$" chưa thể khẳng định ngay tính đúng hay sai vì phụ thuộc vào giá trị của biến $n$ (ví dụ với $n = 1$ thì $2(1) + 1 = 3$ là số nguyên tố, nhưng với $n = 4$ thì $2(4) + 1 = 9$ là hợp số). Do đó đây là **mệnh đề chứa biến**. Các câu A và D là mệnh đề toán học đúng; câu B là câu hỏi nên không phải mệnh đề.',
  },
  {
    id: 2,
    topic: 'Xác định tính đúng sai của mệnh đề',
    level: 'Thông hiểu',
    prompt: 'Trong các mệnh đề toán học dưới đây, mệnh đề nào là mệnh đề **đúng**?',
    options: [
      { key: 'A', text: '$\\forall x \\in \\mathbb{R},\\; x^2 > 0$.' },
      { key: 'B', text: '$\\exists n \\in \\mathbb{N},\\; n^2 + 1$ chia hết cho $4$.' },
      { key: 'C', text: '$\\forall x \\in \\mathbb{R},\\; x^2 - 2x + 2 > 0$.' },
      { key: 'D', text: '$\\exists x \\in \\mathbb{Q},\\; x^2 = 3$.' },
    ],
    correctKey: 'C',
    explanation:
      'Ta có $x^2 - 2x + 2 = (x - 1)^2 + 1$. Vì $(x - 1)^2 \\ge 0$ với mọi $x \\in \\mathbb{R}$ nên $(x - 1)^2 + 1 \\ge 1 > 0$ với mọi $x \\in \\mathbb{R}$. Vậy mệnh đề C **đúng**. Câu A sai tại $x = 0$ ($0^2 = 0$); câu B sai vì $n^2$ chia $4$ chỉ dư $0$ hoặc $1$ nên $n^2 + 1$ chia $4$ dư $1$ hoặc $2$; câu D sai vì $\\pm\\sqrt{3} \\notin \\mathbb{Q}$.',
  },
  {
    id: 3,
    topic: 'Mệnh đề phủ định chứa kí hiệu ∀, ∃',
    level: 'Thông hiểu',
    prompt:
      'Cho mệnh đề $P$: "$\\forall x \\in \\mathbb{R},\\; x^2 + x + 1 > 0$". Mệnh đề phủ định $\\overline{P}$ của mệnh đề $P$ là:',
    options: [
      { key: 'A', text: '$\\exists x \\in \\mathbb{R},\\; x^2 + x + 1 \\le 0$.' },
      { key: 'B', text: '$\\exists x \\in \\mathbb{R},\\; x^2 + x + 1 < 0$.' },
      { key: 'C', text: '$\\forall x \\in \\mathbb{R},\\; x^2 + x + 1 \\le 0$.' },
      { key: 'D', text: '$\\exists x \\notin \\mathbb{R},\\; x^2 + x + 1 \\le 0$.' },
    ],
    correctKey: 'A',
    explanation:
      'Khi lập mệnh đề phủ định của mệnh đề chứa lượng từ $\\forall$, ta đổi $\\forall$ thành $\\exists$, giữ nguyên miền giá trị $x \\in \\mathbb{R}$ và phủ định bất đẳng thức "$> 0$" thành "$\\le 0$". Vậy $\\overline{P}$ là "$\\exists x \\in \\mathbb{R},\\; x^2 + x + 1 \\le 0$".',
  },
  {
    id: 4,
    topic: 'Mệnh đề kéo theo (P ⇒ Q)',
    level: 'Thông hiểu',
    prompt:
      'Cho hai mệnh đề $P$: "$\\sqrt{2} > 1,5$" và $Q$: "Tổng ba góc trong một tam giác bằng $180^\\circ$". Phát biểu mệnh đề $P \\Rightarrow Q$ và xác định tính đúng sai của nó.',
    options: [
      {
        key: 'A',
        text: '"Nếu $\\sqrt{2} > 1,5$ thì tổng ba góc trong một tam giác bằng $180^\\circ$." — Mệnh đề **sai**.',
      },
      {
        key: 'B',
        text: '"Nếu $\\sqrt{2} > 1,5$ thì tổng ba góc trong một tam giác bằng $180^\\circ$." — Mệnh đề **đúng**.',
      },
      {
        key: 'C',
        text: '"Nếu tổng ba góc trong một tam giác bằng $180^\\circ$ thì $\\sqrt{2} > 1,5$." — Mệnh đề **đúng**.',
      },
      {
        key: 'D',
        text: '"Nếu tổng ba góc trong một tam giác bằng $180^\\circ$ thì $\\sqrt{2} > 1,5$." — Mệnh đề **sai**.',
      },
    ],
    correctKey: 'B',
    explanation:
      'Mệnh đề kéo theo $P \\Rightarrow Q$ phát biểu là "Nếu $P$ thì $Q$": "Nếu $\\sqrt{2} > 1,5$ thì tổng ba góc trong một tam giác bằng $180^\\circ$". Vì $\\sqrt{2} \\approx 1,414 < 1,5$ nên $P$ **sai**, còn $Q$ **đúng**. Mệnh đề $P \\Rightarrow Q$ chỉ sai khi $P$ đúng và $Q$ sai; do đó ở đây $P \\Rightarrow Q$ là mệnh đề **đúng**.',
  },
  {
    id: 5,
    topic: 'Mệnh đề đảo và mệnh đề tương đương (P ⇔ Q)',
    level: 'Vận dụng',
    prompt:
      'Xét các cặp mệnh đề $P$ và $Q$ dưới đây. Trong trường hợp nào cả mệnh đề $P \\Rightarrow Q$ và mệnh đề đảo $Q \\Rightarrow P$ đều **đúng** (tức là mệnh đề tương đương $P \\Leftrightarrow Q$ đúng)?',
    options: [
      { key: 'A', text: '$P$: "$n$ chia hết cho $3$" và $Q$: "$n$ chia hết cho $9$" (với $n \\in \\mathbb{Z}$).' },
      { key: 'B', text: '$P$: "$x^2 > 4$" và $Q$: "$x > 2$" (với $x \\in \\mathbb{R}$).' },
      { key: 'C', text: '$P$: "Tam giác $ABC$ vuông tại $A$" và $Q$: "$AB^2 + AC^2 = BC^2$".' },
      {
        key: 'D',
        text: '$P$: "Tứ giác $ABCD$ là hình chữ nhật" và $Q$: "Tứ giác $ABCD$ có hai đường chéo bằng nhau".',
      },
    ],
    correctKey: 'C',
    explanation:
      'Mệnh đề tương đương $P \\Leftrightarrow Q$ đúng khi cả $P \\Rightarrow Q$ và $Q \\Rightarrow P$ đều đúng. Theo định lí Pythagore thuận và đảo, tam giác $ABC$ vuông tại $A$ khi và chỉ khi $AB^2 + AC^2 = BC^2$, nên đáp án C đúng. Các câu khác đều sai ở một chiều: A sai chiều $P \\Rightarrow Q$ khi $n = 3$; B sai chiều $P \\Rightarrow Q$ khi $x = -3$; D sai chiều $Q \\Rightarrow P$ với hình thang cân.',
  },
  {
    id: 6,
    topic: 'Điều kiện cần, điều kiện đủ',
    level: 'Vận dụng',
    prompt:
      'Cho định lí: "Nếu một số tự nhiên có chữ số tận cùng bằng $0$ thì số đó chia hết cho $5$". Phát biểu nào sau đây sử dụng đúng thuật ngữ **điều kiện cần** hoặc **điều kiện đủ**?',
    options: [
      {
        key: 'A',
        text: 'Số tự nhiên chia hết cho $5$ là **điều kiện đủ** để số đó có chữ số tận cùng bằng $0$.',
      },
      {
        key: 'B',
        text: 'Số tự nhiên có chữ số tận cùng bằng $0$ là **điều kiện cần** để số đó chia hết cho $5$.',
      },
      {
        key: 'C',
        text: 'Số tự nhiên có chữ số tận cùng bằng $0$ là **điều kiện cần và đủ** để số đó chia hết cho $5$.',
      },
      {
        key: 'D',
        text: 'Số tự nhiên chia hết cho $5$ là **điều kiện cần** để số đó có chữ số tận cùng bằng $0$.',
      },
    ],
    correctKey: 'D',
    explanation:
      'Đặt $P$: "Số tự nhiên có chữ số tận cùng bằng $0$" và $Q$: "Số tự nhiên chia hết cho $5$". Vì định lí $P \\Rightarrow Q$ đúng nên $P$ là **điều kiện đủ** để có $Q$, còn $Q$ là **điều kiện cần** để có $P$. Do đó câu D ("Số tự nhiên chia hết cho $5$ là điều kiện cần để số đó có chữ số tận cùng bằng $0$") là phát biểu đúng. Chiều đảo $Q \\Rightarrow P$ sai (ví dụ $15$ chia hết cho $5$ nhưng tận cùng là $5$), nên A, B, C đều sai.',
  },
];

export function shuffleQuestions(questions: Question[]): Question[] {
  const copy = [...questions];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
