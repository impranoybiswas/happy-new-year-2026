document.addEventListener("DOMContentLoaded", () => {
  /* ---------- TEXT REVEAL UTILITY ---------- */
  function revealText(element, delay = 0, stagger = 120) {
    if (!element) return;

    const text = element.textContent;
    element.textContent = "";

    const letters = [...text].map((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.opacity = "0";
      span.style.transform = "translateY(40px)";
      span.style.display = "inline-block";
      span.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      element.appendChild(span);
      return span;
    });

    setTimeout(() => {
      letters.forEach((letter, i) => {
        setTimeout(() => {
          letter.style.opacity = "1";
          letter.style.transform = "translateY(0)";
        }, i * stagger);
      });
    }, delay);
  }

  /* ---------- APPLY REVEALS ---------- */
  const greeting = document.getElementById("greeting");
  const year = document.getElementById("year");

  revealText(greeting, 300, 140); // elegant, flowing
  revealText(year, 1200, 80); // stronger, faster impact

  /* ---------- SPARKLES CANVAS ---------- */
  const sparkCanvas = document.getElementById("sparkles");
  if (sparkCanvas) {
    const ctx = sparkCanvas.getContext("2d");

    let w, h, dpr;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;

      sparkCanvas.width = w * dpr;
      sparkCanvas.height = h * dpr;
      sparkCanvas.style.width = w + "px";
      sparkCanvas.style.height = h + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const sparkleCount = Math.min(100, Math.floor((w * h) / 8000));
    const sparkles = [];

    function createSparkle(reset = false) {
      return {
        x: Math.random() * w,
        y: reset ? h + Math.random() * 50 : Math.random() * h,
        r: Math.random() * 0.5 + 0.4,
        alpha: Math.random(),
        speed: Math.random() * 0.035 + 0.005,
        drift: (Math.random() - 0.5) * 0.15,
      };
    }

    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push(createSparkle());
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);

      for (const p of sparkles) {
        // twinkle
        p.alpha += p.speed;
        const a = Math.abs(Math.sin(p.alpha));

        // gentle upward drift
        p.y -= 0.05;
        p.x += p.drift;

        // recycle sparkle
        if (p.y < -10 || p.x < -10 || p.x > w + 10) {
          Object.assign(p, createSparkle(true));
        }

        // glow
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.r * 4
        );

        gradient.addColorStop(0, `rgba(255,255,255,${a})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ---------- FIREWORKS CANVAS ---------- */
  const fireCanvas = document.getElementById("fireworks");
  if (fireCanvas) {
    const fireCtx = fireCanvas.getContext("2d");

    let w = (fireCanvas.width = window.innerWidth);
    let h = (fireCanvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      w = fireCanvas.width = window.innerWidth;
      h = fireCanvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ["#FFD166", "#EF476F", "#06D6A0", "#118AB2", "#F7B801"];

    function blast(x, y) {
      for (let i = 0; i < 50; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 6 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: Math.random() * 60 + 40,
          c: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    let frame = 0;
    function loop() {
      frame++;
      fireCtx.fillStyle = "rgba(10, 10, 20, 0.23)";
      fireCtx.fillRect(0, 0, w, h);

      if (frame % 25 === 0) {
        blast(Math.random() * w, Math.random() * h * 0.6);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.life--;

        fireCtx.beginPath();
        fireCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        fireCtx.fillStyle = p.c;
        fireCtx.fill();

        if (p.life <= 0) particles.splice(i, 1);
      }

      requestAnimationFrame(loop);
    }

    loop();
    sparkCanvas.addEventListener("click", (e) => blast(e.clientX, e.clientY));
  }

  /* ---------- CLICK TO AUDIO ---------- */

  const audio = document.getElementById("bgAudio");
  if (!audio) return;

  let isPlaying = false; // track audio state

  const toggleAudio = async () => {
    try {
      if (!isPlaying) {
        audio.volume = 1;
        await audio.play();
        isPlaying = true;
        console.log("Audio playing");
      } else {
        audio.pause();
        audio.currentTime = 0; // optional: reset to start
        isPlaying = false;
        console.log("Audio stopped");
      }
    } catch (err) {
      console.warn("Audio blocked, waiting for user interaction");
    }
  };

  // user interactions
  window.addEventListener("click", toggleAudio);
  window.addEventListener("touchstart", toggleAudio);
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") toggleAudio(); // optional: toggle with spacebar
  });
});
