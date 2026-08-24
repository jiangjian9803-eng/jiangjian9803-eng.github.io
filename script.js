document.getElementById("year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const agentButton = document.getElementById("run-agent");
const agentInput = document.getElementById("agent-task");
const agentOutput = document.getElementById("agent-output");
const progressBar = document.getElementById("agent-progress-bar");
const agentStepNodes = [...document.querySelectorAll(".agent-steps > div")];
const stageCopy = [
  "Breaking the goal into scope, criteria, and evidence requirements…",
  "Identifying source classes and retrieving comparable technical signals…",
  "Scoring evidence quality, contradictions, freshness, and decision risk…",
  "Building a concise recommendation with caveats and next actions…",
];

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

agentButton.addEventListener("click", async () => {
  const task = agentInput.value.trim() || "Analyze the requested topic";
  agentButton.disabled = true;
  agentStepNodes.forEach((node) => {
    node.classList.remove("active", "done");
    node.querySelector("small").textContent = "Waiting";
  });
  progressBar.style.width = "0";

  for (let index = 0; index < agentStepNodes.length; index += 1) {
    const node = agentStepNodes[index];
    node.classList.add("active");
    node.querySelector("small").textContent = "Running";
    agentOutput.innerHTML = `<span>$</span> ${stageCopy[index]}`;
    progressBar.style.width = `${(index + 1) * 25}%`;
    await wait(650);
    node.classList.remove("active");
    node.classList.add("done");
    node.querySelector("small").textContent = "Complete ✓";
  }

  agentOutput.innerHTML = `<span>$</span> Workflow complete for “${task.replace(/[<>]/g, "")}”. The production version would now return cited evidence, confidence, and an audit trail.`;
  agentButton.disabled = false;
});

const threshold = document.getElementById("threshold");
const metricElements = {
  precision: document.getElementById("precision-value"),
  recall: document.getElementById("recall-value"),
  f1: document.getElementById("f1-value"),
};

function updateClassifier() {
  const value = Number(threshold.value) / 100;
  const precision = Math.round(58 + value * 37);
  const recall = Math.round(108 - value * 49);
  const f1 = Math.round((2 * precision * recall) / (precision + recall));
  const positives = 42;
  const negatives = 58;
  const truePositive = Math.round((recall / 100) * positives);
  const falseNegative = positives - truePositive;
  const falsePositive = Math.max(1, Math.round(truePositive * (1 / (precision / 100) - 1)));
  const trueNegative = negatives - falsePositive;

  document.getElementById("threshold-value").textContent = value.toFixed(2);
  [["precision", precision], ["recall", recall], ["f1", f1]].forEach(([name, metric]) => {
    metricElements[name].textContent = `${metric}%`;
    document.getElementById(`${name}-bar`).style.width = `${metric}%`;
  });
  document.getElementById("tp-value").textContent = truePositive;
  document.getElementById("fn-value").textContent = falseNegative;
  document.getElementById("fp-value").textContent = falsePositive;
  document.getElementById("tn-value").textContent = trueNegative;
}

threshold.addEventListener("input", updateClassifier);
updateClassifier();

const canvas = document.getElementById("network-canvas");
const context = canvas.getContext("2d");
let particles = [];

function sizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const bounds = canvas.getBoundingClientRect();
  canvas.width = bounds.width * ratio;
  canvas.height = bounds.height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(55, Math.floor(bounds.width / 22)) }, () => ({
    x: Math.random() * bounds.width,
    y: Math.random() * bounds.height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
  }));
}

function drawNetwork() {
  const bounds = canvas.getBoundingClientRect();
  context.clearRect(0, 0, bounds.width, bounds.height);
  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    if (particle.x < 0 || particle.x > bounds.width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > bounds.height) particle.vy *= -1;
    context.fillStyle = "rgba(43,217,196,.7)";
    context.beginPath();
    context.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2);
    context.fill();
    particles.slice(index + 1).forEach((other) => {
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (distance < 125) {
        context.strokeStyle = `rgba(75,126,190,${(1 - distance / 125) * 0.22})`;
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    });
  });
  requestAnimationFrame(drawNetwork);
}

window.addEventListener("resize", sizeCanvas);
sizeCanvas();
drawNetwork();
