"use client";

import { useEffect } from "react";

export default function ClientExperience() {
  useEffect(() => {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

    const button = document.getElementById("run-agent");
    const input = document.getElementById("agent-task");
    const output = document.getElementById("agent-output");
    const progress = document.getElementById("agent-progress-bar");
    const steps = [...document.querySelectorAll(".agent-steps > div")];
    const copy = [
      "Decomposing the request into files, constraints, and acceptance criteria…",
      "Retrieving relevant context and selecting the smallest safe change…",
      "Evaluating implementation risk, tests, and edge cases…",
      "Synthesizing a patch, verification plan, and concise handoff…",
    ];
    let stopped = false;

    const runAgent = async () => {
      const task = input?.value.trim() || "Build the requested feature";
      if (!button || !output || !progress) return;
      button.disabled = true;
      steps.forEach((node) => {
        node.classList.remove("active", "done");
        node.querySelector("small").textContent = "Waiting";
      });
      progress.style.width = "0";
      for (let index = 0; index < steps.length; index += 1) {
        if (stopped) return;
        const node = steps[index];
        node.classList.add("active");
        node.querySelector("small").textContent = "Running";
        output.innerHTML = `<span>$</span> ${copy[index]}`;
        progress.style.width = `${(index + 1) * 25}%`;
        await new Promise((resolve) => window.setTimeout(resolve, 650));
        node.classList.remove("active");
        node.classList.add("done");
        node.querySelector("small").textContent = "Complete ✓";
      }
      output.innerHTML = `<span>$</span> Coding plan ready for “${task.replace(/[<>]/g, "")}”. A production agent would now propose a reviewable patch, run tests, and report evidence.`;
      button.disabled = false;
    };
    button?.addEventListener("click", runAgent);

    const threshold = document.getElementById("threshold");
    const updateClassifier = () => {
      if (!threshold) return;
      const value = Number(threshold.value) / 100;
      const precision = Math.round(58 + value * 37);
      const recall = Math.round(108 - value * 49);
      const f1 = Math.round((2 * precision * recall) / (precision + recall));
      const positives = 42;
      const negatives = 58;
      const tp = Math.round((recall / 100) * positives);
      const fn = positives - tp;
      const fp = Math.max(1, Math.round(tp * (1 / (precision / 100) - 1)));
      const tn = negatives - fp;
      document.getElementById("threshold-value").textContent = value.toFixed(2);
      [["precision", precision], ["recall", recall], ["f1", f1]].forEach(([name, metric]) => {
        document.getElementById(`${name}-value`).textContent = `${metric}%`;
        document.getElementById(`${name}-bar`).style.width = `${metric}%`;
      });
      [["tp", tp], ["fn", fn], ["fp", fp], ["tn", tn]].forEach(([name, metric]) => {
        document.getElementById(`${name}-value`).textContent = metric;
      });
    };
    threshold?.addEventListener("input", updateClassifier);
    updateClassifier();

    const canvas = document.getElementById("network-canvas");
    const context = canvas?.getContext("2d");
    let frame;
    let particles = [];
    const resize = () => {
      if (!canvas || !context) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const bounds = canvas.getBoundingClientRect();
      canvas.width = bounds.width * ratio;
      canvas.height = bounds.height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(55, Math.floor(bounds.width / 22)) }, () => ({
        x: Math.random() * bounds.width, y: Math.random() * bounds.height,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      }));
    };
    const draw = () => {
      if (!canvas || !context || stopped) return;
      const bounds = canvas.getBoundingClientRect();
      context.clearRect(0, 0, bounds.width, bounds.height);
      particles.forEach((particle, index) => {
        particle.x += particle.vx; particle.y += particle.vy;
        if (particle.x < 0 || particle.x > bounds.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > bounds.height) particle.vy *= -1;
        context.fillStyle = "rgba(43,217,196,.7)";
        context.beginPath(); context.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2); context.fill();
        particles.slice(index + 1).forEach((other) => {
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance < 125) {
            context.strokeStyle = `rgba(75,126,190,${(1 - distance / 125) * 0.22})`;
            context.beginPath(); context.moveTo(particle.x, particle.y); context.lineTo(other.x, other.y); context.stroke();
          }
        });
      });
      frame = window.requestAnimationFrame(draw);
    };
    window.addEventListener("resize", resize); resize(); draw();

    return () => {
      stopped = true; observer.disconnect();
      button?.removeEventListener("click", runAgent);
      threshold?.removeEventListener("input", updateClassifier);
      window.removeEventListener("resize", resize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
