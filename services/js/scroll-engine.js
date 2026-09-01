/**
 * Scroll-pinned slide engine — rAF updates, eased jumps, GPU fades.
 */
(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pins = [...document.querySelectorAll("[data-pin]")];
    const indexLinks = [...document.querySelectorAll("[data-index-target]")];
    const switcherLinks = [...document.querySelectorAll("[data-switch-target]")];

    if (!pins.length) return;

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
    const easeOutCubic = (t) => 1 - (1 - t) ** 3;

    const slideSets = pins.map((pin) => ({
        pin,
        visuals: [...pin.querySelectorAll(".os-visuals .os-slide")],
        copies: [...pin.querySelectorAll(".os-copy-stack .os-slide")],
        slides: Number(pin.dataset.slides) || pin.querySelectorAll(".os-copy-stack .os-slide").length,
        theme: pin.dataset.theme,
        id: pin.id,
        autoLoop: Number(pin.dataset.autoLoop) || 0,
        name: pin.dataset.name || pin.id,
        nextBtn: pin.querySelector("[data-os-next]"),
        nextLabel: pin.querySelector(".os-next-label"),
    }));

    const indexByPin = Object.fromEntries(slideSets.map((set) => [set.id, 0]));
    const setById = Object.fromEntries(slideSets.map((set) => [set.id, set]));

    let metrics = [];
    let viewportH = window.innerHeight;
    let ticking = false;
    let lastPinId = "";
    let lastSlideKey = "";
    let hubTimer = null;
    let hubPaused = false;
    let scrollAnim = 0;

    const hubSet = slideSets.find((set) => set.autoLoop > 0);
    const hubDots = hubSet ? [...hubSet.pin.querySelectorAll("[data-hub-slide]")] : [];

    function pinTop(pin) {
        let top = 0;
        let node = pin;
        while (node) {
            top += node.offsetTop;
            node = node.offsetParent;
        }
        return top;
    }

    function measure() {
        viewportH = window.innerHeight;
        metrics = slideSets.map((set) => ({
            ...set,
            top: pinTop(set.pin),
            height: set.pin.offsetHeight,
        }));
    }

    function setHubDots(index) {
        hubDots.forEach((dot, i) => {
            const on = i === index;
            if (dot.classList.contains("is-current") === on) return;
            dot.classList.toggle("is-current", on);
            dot.setAttribute("aria-selected", on ? "true" : "false");
        });
    }

    function setNextLabel(set, index) {
        if (!set.nextBtn) return;
        const last = index >= set.slides - 1;
        const order = metrics.length ? metrics : slideSets;
        const next = order[order.findIndex((item) => item.id === set.id) + 1];

        if (last && !next) {
            set.nextBtn.hidden = true;
            return;
        }

        set.nextBtn.hidden = false;
        const text = last && next ? `Next: ${next.name}` : "Next";
        if (set.nextLabel && set.nextLabel.textContent !== text) {
            set.nextLabel.textContent = text;
            set.nextBtn.setAttribute("aria-label", text);
        }
    }

    function armWillChange(el) {
        el.style.willChange = "opacity, transform";
        const done = () => {
            el.style.willChange = "auto";
            el.removeEventListener("transitionend", done);
        };
        el.addEventListener("transitionend", done);
    }

    function setActiveSlide(set, index) {
        const prev = indexByPin[set.id];
        if (prev === index && lastSlideKey === `${set.id}:${index}`) {
            setNextLabel(set, index);
            return;
        }

        indexByPin[set.id] = index;

        const apply = (els) => {
            if (els[prev] && prev !== index) {
                els[prev].classList.remove("is-active");
                armWillChange(els[prev]);
            }
            if (els[index]) {
                els[index].classList.add("is-active");
                armWillChange(els[index]);
            }
        };

        apply(set.visuals);
        apply(set.copies);
        if (set.autoLoop) setHubDots(index);
        setNextLabel(set, index);
        lastSlideKey = `${set.id}:${index}`;
    }

    function setChrome(pinId, theme) {
        if (document.documentElement.dataset.theme !== theme) {
            document.documentElement.dataset.theme = theme;
        }
        indexLinks.forEach((link) => {
            const on = link.dataset.indexTarget === pinId;
            if (link.classList.contains("is-current") === on) return;
            link.classList.toggle("is-current", on);
            if (on) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
        });
        switcherLinks.forEach((link) => {
            const on = link.dataset.switchTarget === pinId;
            if (link.classList.contains("is-current") === on) return;
            link.classList.toggle("is-current", on);
            if (on) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
        });
    }

    function stopHubLoop() {
        window.clearInterval(hubTimer);
        hubTimer = null;
    }

    function startHubLoop() {
        if (!hubSet || reduced.matches || hubTimer) return;
        hubTimer = window.setInterval(() => {
            if (hubPaused || document.hidden) return;
            setActiveSlide(hubSet, (indexByPin[hubSet.id] + 1) % hubSet.slides);
        }, hubSet.autoLoop);
    }

    function activeFromScroll() {
        const probe = window.scrollY + viewportH * 0.42;
        let active = metrics[0];
        for (let i = 0; i < metrics.length; i += 1) {
            const m = metrics[i];
            if (probe >= m.top && probe < m.top + m.height) active = m;
        }
        return active;
    }

    function update() {
        if (document.documentElement.classList.contains("os-static")) return;
        const active = activeFromScroll();
        if (!active) return;

        if (active.id !== lastPinId) {
            lastPinId = active.id;
            setChrome(active.id, active.theme);
            if (active.autoLoop) startHubLoop();
            else stopHubLoop();
        }

        if (active.autoLoop) return;

        const range = Math.max(1, active.height - viewportH);
        const t = clamp((window.scrollY - active.top) / range, 0, 0.9999);
        const idx = Math.min(active.slides - 1, Math.floor(t * active.slides));
        const key = `${active.id}:${idx}`;
        if (key !== lastSlideKey) setActiveSlide(active, idx);
    }

    function requestTick() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            update();
            ticking = false;
        });
    }

    function cancelScrollAnim() {
        if (scrollAnim) {
            cancelAnimationFrame(scrollAnim);
            scrollAnim = 0;
        }
    }

    function animateScrollTo(targetY) {
        cancelScrollAnim();
        const start = window.scrollY;
        const dist = targetY - start;
        if (Math.abs(dist) < 2) {
            window.scrollTo(0, targetY);
            requestTick();
            return;
        }

        const duration = clamp(Math.abs(dist) * 0.42, 420, 820);
        const t0 = performance.now();

        const step = (now) => {
            const p = Math.min(1, (now - t0) / duration);
            window.scrollTo(0, start + dist * easeOutCubic(p));
            if (p < 1) {
                scrollAnim = requestAnimationFrame(step);
            } else {
                scrollAnim = 0;
                requestTick();
            }
        };

        scrollAnim = requestAnimationFrame(step);
    }

    function scrollToPin(id) {
        const m = metrics.find((item) => item.id === id) || setById[id];
        if (!m) return;
        const top = m.top ?? pinTop(m.pin);
        if (reduced.matches) {
            window.scrollTo(0, top);
            return;
        }
        animateScrollTo(top);
    }

    function scrollToSlide(set, index) {
        const m = metrics.find((item) => item.id === set.id) || set;
        const range = Math.max(1, m.height - viewportH);
        const top = m.top + ((index + 0.12) / set.slides) * range;
        if (reduced.matches) {
            window.scrollTo(0, top);
            return;
        }
        animateScrollTo(top);
    }

    function goNext(set) {
        const i = indexByPin[set.id];
        if (i < set.slides - 1) {
            if (document.documentElement.classList.contains("os-static")) {
                set.copies[i + 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveSlide(set, i + 1);
                return;
            }
            scrollToSlide(set, i + 1);
            return;
        }
        const order = metrics.length ? metrics : slideSets;
        const next = order[order.findIndex((item) => item.id === set.id) + 1];
        if (next) scrollToPin(next.id);
    }

    function bindJumps() {
        const handler = (event) => {
            const link = event.currentTarget;
            const id = link.dataset.indexTarget || link.dataset.switchTarget || link.dataset.jumpTarget;
            if (!id) return;
            event.preventDefault();
            scrollToPin(id);
        };

        [...indexLinks, ...switcherLinks, ...document.querySelectorAll("[data-jump-target]")].forEach((el) => {
            el.addEventListener("click", handler);
        });
    }

    function bindNext() {
        slideSets.forEach((set) => {
            set.nextBtn?.addEventListener("click", () => goNext(set));
        });
    }

    function bindHub() {
        if (!hubSet) return;
        const frame = hubSet.pin.querySelector(".os-sticky");
        frame?.addEventListener("pointerenter", () => {
            hubPaused = true;
        });
        frame?.addEventListener("pointerleave", () => {
            hubPaused = false;
        });
        hubDots.forEach((dot) => {
            dot.addEventListener("click", () => {
                setActiveSlide(hubSet, Number(dot.dataset.hubSlide));
                stopHubLoop();
                startHubLoop();
            });
        });
        document.addEventListener("visibilitychange", () => {
            hubPaused = document.hidden;
            if (document.hidden) cancelScrollAnim();
        });
    }

    function onUserScrollInterrupt() {
        if (scrollAnim) cancelScrollAnim();
        requestTick();
    }

    function onResize() {
        measure();
        lastPinId = "";
        lastSlideKey = "";
        requestTick();
    }

    let resizeTimer = 0;
    window.addEventListener(
        "resize",
        () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(onResize, 150);
        },
        { passive: true }
    );

    bindJumps();
    bindNext();
    bindHub();

    const navSlot = document.getElementById("navbar");
    if (navSlot) {
        const observer = new MutationObserver(() => {
            measure();
            requestTick();
            if (navSlot.querySelector(".navbar")) observer.disconnect();
        });
        observer.observe(navSlot, { childList: true });
    }

    if (reduced.matches) {
        document.documentElement.classList.add("os-static");
        setChrome(pins[0].id, pins[0].dataset.theme);
        slideSets.forEach((set) => {
            set.visuals.forEach((el) => el.classList.add("is-active"));
            set.copies.forEach((el) => el.classList.add("is-active"));
        });
        return;
    }

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("wheel", onUserScrollInterrupt, { passive: true });
    window.addEventListener("touchstart", onUserScrollInterrupt, { passive: true });
    window.addEventListener("keydown", (event) => {
        if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
            onUserScrollInterrupt();
        }
    });

    measure();
    setChrome(pins[0].id, pins[0].dataset.theme);
    setActiveSlide(slideSets[0], 0);
    lastPinId = pins[0].id;
    startHubLoop();
    requestTick();
})();
