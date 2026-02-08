let messageIndex = 0;

const messages = [
  "Are you sure? 🥺",
  "Think again… I’m cute though 😭",
  "Nope. Try again 😼",
  "Please? I’ll buy you snacks 🍪",
  "Final answer? (It’s YES 😌)"
];

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const prompt = document.getElementById("prompt");
const hint = document.getElementById("hint");

// Keep button movement within the card
const card = document.querySelector(".card");

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function burstHearts(x, y, count = 12) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "flying-heart";
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    heart.style.setProperty("--dx", (Math.random() * 220 - 110) + "px");
    heart.style.setProperty("--dy", (Math.random() * 220 + 40) + "px");
    heart.style.setProperty("--rot", (Math.random() * 360 - 180) + "deg");
    heart.style.setProperty("--dur", (0.9 + Math.random() * 0.6) + "s");
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1700);
  }
}

function growYesButton() {
  const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
  const newSize = Math.min(currentSize * 1.18, 56); // cap
  yesBtn.style.fontSize = `${newSize}px`;
  yesBtn.style.transform = "translateY(-1px)";
  setTimeout(() => (yesBtn.style.transform = ""), 120);
}

function moveNoButton() {
  const cardRect = card.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // available area inside card
  const padding = 16;
  const minX = cardRect.left + padding;
  const maxX = cardRect.right - btnRect.width - padding;
  const minY = cardRect.top + padding + 70;   // avoid title area
  const maxY = cardRect.bottom - btnRect.height - padding - 20;

  const targetX = clamp(
    minX + Math.random() * (maxX - minX),
    minX,
    maxX
  );

  const targetY = clamp(
    minY + Math.random() * (maxY - minY),
    minY,
    maxY
  );

  // convert to translate relative to current position
  const dx = targetX - btnRect.left;
  const dy = targetY - btnRect.top;

  noBtn.style.transform = `translate(${dx}px, ${dy}px)`;
}

function handleNoClick(e) {
  prompt.textContent = messages[messageIndex];
  hint.textContent = "Okay… but look at the YES button 👀";

  messageIndex = (messageIndex + 1) % messages.length;

  growYesButton();

  const clickX = e.clientX ?? (window.innerWidth / 2);
  const clickY = e.clientY ?? (window.innerHeight / 2);
  burstHearts(clickX, clickY, 10);

  moveNoButton();
}

function handleYesClick(e) {
  const rect = yesBtn.getBoundingClientRect();
  burstHearts(rect.left + rect.width * 0.5, rect.top + rect.height * 0.3, 22);

  // small delay for effect then redirect
  setTimeout(() => {
    window.location.href = "yes_page.html";
  }, 350);
}

// Make NO extra slippery: move on hover/touch too (mobile-friendly)
function handleNoHoverOrTouch(e) {
  // only start dodging after first interaction for less “too aggressive”
  if (messageIndex > 0) moveNoButton();
}

noBtn.addEventListener("click", handleNoClick);
noBtn.addEventListener("mouseenter", handleNoHoverOrTouch);
noBtn.addEventListener("touchstart", (e) => {
  // prevent scrolling jitter
  e.preventDefault();
  handleNoClick(e.touches[0]);
}, { passive: false });

yesBtn.addEventListener("click", handleYesClick);

// initial position reset on resize
window.addEventListener("resize", () => {
  noBtn.style.transform = "";
});
