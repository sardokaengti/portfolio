function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({
        behavior: "smooth"
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll(".reveal"));
    const hero = document.querySelector(".hero");
    const particleLayer = document.querySelector(".particle-layer");

    revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 60, 420)}ms`;
    });

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("visible"));
    }

    const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
    const projectCards = Array.from(document.querySelectorAll(".project-card"));

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const filter = button.dataset.filter || "all";

                filterButtons.forEach((btn) => btn.classList.remove("active"));
                button.classList.add("active");

                projectCards.forEach((card) => {
                    const tags = (card.dataset.tags || "").split(/\s+/).filter(Boolean);
                    const isMatch = filter === "all" || tags.includes(filter);
                    card.classList.toggle("is-hidden", !isMatch);
                });
            });
        });
    }

    if (hero && !prefersReducedMotion) {
        let isTicking = false;

        const updateSweepFromScroll = () => {
            const rect = hero.getBoundingClientRect();
            const viewportHeight = window.innerHeight || 1;
            const total = rect.height + viewportHeight;
            const rawProgress = (viewportHeight - rect.top) / total;
            const progress = Math.max(0, Math.min(1, rawProgress));

            const sweepX = -180 + (progress * 360);
            const sweepY = -120 + (progress * 180);
            const sweepOpacity = 0.1 + (progress * 0.22);

            hero.style.setProperty("--sweep-x", `${sweepX.toFixed(1)}px`);
            hero.style.setProperty("--sweep-y", `${sweepY.toFixed(1)}px`);
            hero.style.setProperty("--sweep-opacity", sweepOpacity.toFixed(3));
            isTicking = false;
        };

        const onSweepScroll = () => {
            if (isTicking) return;
            isTicking = true;
            window.requestAnimationFrame(updateSweepFromScroll);
        };

        window.addEventListener("scroll", onSweepScroll, { passive: true });
        window.addEventListener("resize", onSweepScroll);
        onSweepScroll();
    }

    if (particleLayer) {
        const randomInRange = (min, max) => Math.random() * (max - min) + min;
        const particleCount = prefersReducedMotion ? 10 : 22;

        particleLayer.innerHTML = "";

        for (let i = 0; i < particleCount; i += 1) {
            const particle = document.createElement("span");
            const isCircle = Math.random() > 0.45;
            const sizePx = randomInRange(2.5, 7.5);
            const shiftX = randomInRange(-120, 120);
            const shiftY = randomInRange(-90, 90);
            const rotation = randomInRange(-70, 70);

            particle.className = `particle ${isCircle ? "circle" : "rect"}`;
            particle.style.setProperty("--x", `${randomInRange(0, 100).toFixed(2)}%`);
            particle.style.setProperty("--y", `${randomInRange(4, 96).toFixed(2)}%`);
            particle.style.setProperty("--size", `${sizePx.toFixed(2)}px`);
            particle.style.setProperty("--alpha", `${randomInRange(0.28, 0.9).toFixed(2)}`);
            particle.style.setProperty("--dur", `${randomInRange(4, 9).toFixed(2)}s`);
            particle.style.setProperty("--delay", `${randomInRange(-18, 0).toFixed(2)}s`);
            particle.style.setProperty("--tx", `${shiftX.toFixed(1)}px`);
            particle.style.setProperty("--ty", `${shiftY.toFixed(1)}px`);
            particle.style.setProperty("--rot", `${rotation.toFixed(1)}deg`);

            particleLayer.appendChild(particle);
        }
    }

    const typedRole = document.getElementById("typed-role");
    if (!typedRole || prefersReducedMotion) {
        return;
    }

    const roles = (typedRole.dataset.roles || "")
        .split("|")
        .map((role) => role.trim())
        .filter(Boolean);

    if (roles.length === 0) {
        return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const runTyping = () => {
        const currentRole = roles[roleIndex];

        if (!deleting) {
            charIndex += 1;
            typedRole.textContent = currentRole.slice(0, charIndex);

            if (charIndex === currentRole.length) {
                deleting = true;
                setTimeout(runTyping, 1200);
                return;
            }

            setTimeout(runTyping, 65);
            return;
        }

        charIndex -= 1;
        typedRole.textContent = currentRole.slice(0, charIndex);

        if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(runTyping, 260);
            return;
        }

        setTimeout(runTyping, 40);
    };

    typedRole.textContent = "";
    runTyping();
});
