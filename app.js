import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import {
  getAnalytics,
  isSupported
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";

// Firebase config của bạn
const firebaseConfig = {
  apiKey: "AIzaSyBvre_YC60Bf1DJZKbVHBKDIflHfvPc1Wk",
  authDomain: "edxembe.firebaseapp.com",
  projectId: "edxembe",
  storageBucket: "edxembe.firebasestorage.app",
  messagingSenderId: "998672401499",
  appId: "1:998672401499:web:b1f47ce2777e57490dab7e",
  measurementId: "G-L1VWJLZHFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Analytics: có browser hỗ trợ thì bật, không thì bỏ qua
isSupported()
  .then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  })
  .catch(() => {
    // Không cần làm gì, app vẫn chạy bình thường
  });

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const question = document.getElementById("question");
const subQuestion = document.getElementById("subQuestion");
const statusText = document.getElementById("status");
const finalBox = document.getElementById("finalBox");
const askBox = document.getElementById("askBox");

const questions = [
  {
    q: "Embe có đồng ý mua KZ EDC Pro cho anh không?",
    s: "Chỉ ~190k thôi, rẻ hơn một lần embe order trà sữa full topping."
  },
  {
    q: "Will you buy me the KZ EDC Pro, my love?",
    s: "Best value. Best sound. Best boyfriend maintenance package."
  },
  {
    q: "Embe mua cho anh nha, được hong?",
    s: "Không mua cũng được... nhưng mua thì anh vui tới Tết."
  },
  {
    q: "¿Me compras los KZ EDC Pro, mi amor?",
    s: "Sí là hạnh phúc. No là nút chạy tiếp."
  },
  {
    q: "買ってくれる？EDC Pro お願い🥺",
    s: "Anime power + budget audio = tình yêu bất diệt."
  },
  {
    q: "Embe ơi, tai anh đang khóc vì chưa có EDC Pro.",
    s: "Một chiếc tai nghe nhỏ, một tình yêu to."
  },
  {
    q: "Do you accept this extremely reasonable financial proposal?",
    s: "Investment: 190k. Return: anh yêu embe thêm 300%."
  },
  {
    q: "Embe không thể bấm No mãi được đâu...",
    s: "Nút No đã bị lập trình để phản bội chính nó."
  },
  {
    q: "Embe suy nghĩ kỹ chưa?",
    s: "EDC Pro có dây tháo rời. Còn tình yêu anh thì không tháo rời được."
  },
  {
    q: "Hợp lý như này mà còn No là hơi ác đó embe.",
    s: "190k đổi lấy một người yêu hạnh phúc, deal này quá thơm."
  },
  {
    q: "Embe có muốn anh nghe nhạc bằng nước mắt không?",
    s: "Bấm Yes để ngăn chặn bi kịch âm thanh."
  },
  {
    q: "Câu hỏi cuối cùng nhưng không phải cuối cùng:",
    s: "Mua EDC Pro cho anh nhaaaaaaaaa."
  }
];

const noTexts = [
  "No 😔",
  "Không nha 😭",
  "Hong mua đâu",
  "Để suy nghĩ",
  "Anh tự mua đi",
  "Nút này bị lỗi",
  "No nhưng yếu lòng",
  "Đừng dí em",
  "Ơ kìa",
  "Không thoát được đâu",
  "404 No not found",
  "No.exe has stopped",
  "Bấm Yes đi mà",
  "Sai nút rồi",
  "Nút này vô dụng",
  "No? thật á?",
  "Embe ác quá",
  "Từ chối bị từ chối"
];

const rejectMessages = [
  "No vừa bị né thành công.",
  "Embe bấm No nhưng vũ trụ không chấp nhận.",
  "Nút No đã nộp đơn nghỉ việc.",
  "Sai thao tác rồi embe, thử nút màu hồng đi.",
  "Hệ thống phát hiện tình yêu, từ chối No.",
  "No không có hiệu lực trong vùng phủ sóng của tình yêu.",
  "Request denied: embe quá dễ thương để bấm No.",
  "Lỗi đạo đức: không thể từ chối món quà 190k.",
  "Nút No đang chạy KPI né tránh.",
  "No bị latency cao, vui lòng bấm Yes."
];

let noCount = 0;
let yesScale = 1;
let noScale = 1;
let noOpacity = 1;
let isMovingNo = false;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateQuestion() {
  const item = questions[noCount % questions.length];
  question.textContent = item.q;
  subQuestion.textContent = item.s;
}

function updateNoStyle() {
  noScale = clamp(1 - noCount * 0.035, 0.42, 1);
  noOpacity = clamp(1 - noCount * 0.025, 0.35, 1);

  const rotate = randomBetween(-35, 35);
  const skew = randomBetween(-8, 8);

  noBtn.style.transform = `scale(${noScale}) rotate(${rotate}deg) skew(${skew}deg)`;
  noBtn.style.opacity = noOpacity;

  if (noCount >= 5) {
    noBtn.style.background = "#f1f1f1";
    noBtn.style.color = "#777";
  }

  if (noCount >= 8) {
    noBtn.style.filter = "blur(0.4px)";
  }

  if (noCount >= 12) {
    noBtn.style.filter = "blur(0.8px)";
    noBtn.style.pointerEvents = "auto";
  }

  if (noCount >= 16) {
    noBtn.style.width = "70px";
    noBtn.style.height = "36px";
    noBtn.style.padding = "4px";
    noBtn.style.fontSize = "12px";
  }
}

function growYesButton() {
  yesScale = clamp(1 + noCount * 0.08, 1, 2.3);
  yesBtn.style.transform = `translateX(-50%) scale(${yesScale})`;

  if (noCount >= 4) {
    yesBtn.textContent = "YES ĐI MÀ EMBE 😭💖";
  }

  if (noCount >= 8) {
    yesBtn.textContent = "YES LÀ HỢP LÝ NHẤT RỒI 💘";
  }

  if (noCount >= 12) {
    yesBtn.textContent = "BẤM YES CỨU ANH 🎧😭";
  }

  if (noCount >= 16) {
    yesBtn.textContent = "EMBE YES ĐI ANH VAN 🥺💖";
  }

  if (noCount >= 20) {
    yesBtn.textContent = "YES = TÌNH YÊU BẤT DIỆT 💍🎧";
  }
}

function moveNoButton(forceFar = false) {
  if (isMovingNo) return;

  isMovingNo = true;

  const box = document.querySelector(".buttons");
  const boxRect = box.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxLeft = Math.max(10, boxRect.width - btnRect.width - 10);
  const maxTop = Math.max(10, boxRect.height - btnRect.height - 10);

  let left = randomBetween(0, maxLeft);
  let top = randomBetween(0, maxTop);

  // Nếu cần chạy xa hơn, ép nút qua góc khác
  if (forceFar) {
    const currentLeft = parseFloat(noBtn.style.left || "0");
    const currentTop = parseFloat(noBtn.style.top || "0");

    const candidates = [
      { left: 5, top: 5 },
      { left: maxLeft, top: 5 },
      { left: 5, top: maxTop },
      { left: maxLeft, top: maxTop },
      { left: maxLeft / 2, top: 5 },
      { left: maxLeft / 2, top: maxTop }
    ];

    candidates.sort((a, b) => {
      const da = Math.hypot(a.left - currentLeft, a.top - currentTop);
      const db = Math.hypot(b.left - currentLeft, b.top - currentTop);
      return db - da;
    });

    left = candidates[0].left;
    top = candidates[0].top;
  }

  noBtn.style.left = `${left}px`;
  noBtn.style.top = `${top}px`;

  noCount++;

  noBtn.textContent = noTexts[noCount % noTexts.length];
  statusText.textContent = rejectMessages[noCount % rejectMessages.length];

  updateQuestion();
  updateNoStyle();
  growYesButton();

  // Sau nhiều lần né thì No bắt đầu rất phản chủ
  if (noCount >= 10 && Math.random() < 0.35) {
    noBtn.textContent = "YES?";
  }

  if (noCount >= 15 && Math.random() < 0.25) {
    statusText.textContent = "Cảnh báo: nút No sắp bị thay thế bởi nút Yes.";
  }

  setTimeout(() => {
    isMovingNo = false;
  }, 120);
}

// Nút No chạy khi chuột lại gần
document.addEventListener("mousemove", (e) => {
  const rect = noBtn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;

  const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

  // Càng về sau vùng phát hiện càng rộng
  const dangerZone = clamp(130 + noCount * 8, 130, 280);

  if (distance < dangerZone) {
    moveNoButton(true);
  }
});

// Hover là chạy
noBtn.addEventListener("mouseenter", () => {
  moveNoButton(true);
});

// Mouse down cũng chạy trước khi click kịp xử lý
noBtn.addEventListener("mousedown", (e) => {
  e.preventDefault();
  moveNoButton(true);
});

// Click No thì không tính, vẫn chạy
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton(true);
});

// Mobile: chạm vào No cũng chạy
noBtn.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    moveNoButton(true);
  },
  { passive: false }
);

// Sau một lúc mà chưa bấm Yes thì tự cà khịa
setInterval(() => {
  if (askBox.classList.contains("hidden")) return;

  const teasing = [
    "Embe đang suy nghĩ hay đang trốn tránh sự hợp lý?",
    "190k vẫn đang đứng đó, rất ngoan và rất đáng mua.",
    "EDC Pro không tự nhiên sinh ra, nó sinh ra để được embe mua.",
    "Nút Yes màu hồng là dành cho người có trái tim đẹp.",
    "Anh chưa có tai nghe, nhưng anh có niềm tin nơi embe.",
    "Mua tai nghe hôm nay, nhận bạn trai vui vẻ cả tuần."
  ];

  if (noCount > 0) {
    statusText.textContent = randomItem(teasing);
  }
}, 7000);

// Bấm Yes thì gửi tín hiệu lên Firebase
yesBtn.addEventListener("click", async () => {
  yesBtn.disabled = true;
  yesBtn.textContent = "ĐANG GỬI TÍN HIỆU TÌNH YÊU... 💌";
  statusText.textContent = "Đợi xíu, Firebase đang chứng giám tình yêu này...";

  try {
    await addDoc(collection(db, "edc_yes_signals"), {
      answer: "YES",
      product: "KZ EDC Pro",
      price: 190000,
      message: "Embe đã đồng ý mua KZ EDC Pro",
      noCountBeforeYes: noCount,
      createdAt: serverTimestamp(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      page: window.location.href
    });

    askBox.classList.add("hidden");
    finalBox.classList.remove("hidden");

    launchConfetti();
  } catch (error) {
    console.error(error);

    yesBtn.disabled = false;
    yesBtn.textContent = "YES 💖";
    statusText.textContent =
      "Firebase lỗi rồi, nhưng về mặt cảm xúc thì embe đã đồng ý. Check lại Firestore Rules nha.";
  }
});

function launchConfetti() {
  const emojis = ["💖", "💘", "🎧", "😭", "✨", "💸", "🥺", "💕", "💍", "🌸"];

  for (let i = 0; i < 130; i++) {
    const span = document.createElement("span");

    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.position = "fixed";
    span.style.left = `${Math.random() * 100}vw`;
    span.style.top = "-40px";
    span.style.fontSize = `${randomBetween(22, 48)}px`;
    span.style.zIndex = "9999";
    span.style.pointerEvents = "none";
    span.style.animation = `emojiFall ${randomBetween(2.5, 5.5)}s linear forwards`;

    document.body.appendChild(span);

    setTimeout(() => span.remove(), 6000);
  }
}

// Inject animation CSS
const style = document.createElement("style");
style.textContent = `
@keyframes emojiFall {
  0% {
    transform: translateY(-40px) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0;
  }
}
`;
document.head.appendChild(style);

// Set vị trí ban đầu cho No cho chắc
window.addEventListener("load", () => {
  noBtn.style.left = "62%";
  noBtn.style.top = "50px";
});
