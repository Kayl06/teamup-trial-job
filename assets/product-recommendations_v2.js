/**
 * Horizon's slideshow advances by the number of slides that are at least 70% visible.
 * Four cards in view would jump a full page. This keeps that slideshow (drag, touch,
 * snap, and the previous/next methods) and makes the buttons move one card.
 */

const SELECTOR = 'slideshow-component[data-step-one]';

/**
 * @param {HTMLElement} slideshow
 * @returns {number}
 */
function visibleCount(slideshow) {
  const raw = getComputedStyle(slideshow).getPropertyValue('--recs-visible').trim();
  const count = Number.parseInt(raw, 10);
  if (!Number.isFinite(count) || count < 1) return 1;
  return count;
}

/**
 * @param {HTMLElement} slideshow
 * @returns {number}
 */
function maxStartIndex(slideshow) {
  const total = slideshow.slides?.length ?? 0;
  return Math.max(total - visibleCount(slideshow), 0);
}

/**
 * @param {HTMLElement} slideshow
 */
function refreshDisabled(slideshow) {
  if (typeof slideshow.next !== 'function') return;
  if (typeof slideshow.current !== 'number') return;
  slideshow.current = slideshow.current;
}

/**
 * @param {HTMLElement} slideshow
 */
function patch(slideshow) {
  if (slideshow.dataset.stepOneBound === 'true') return;
  slideshow.dataset.stepOneBound = 'true';

  Object.defineProperty(slideshow, 'nextIndex', {
    configurable: true,
    get() {
      const total = this.slides?.length ?? 0;
      if (this.current >= maxStartIndex(this)) return total;
      return this.current + 1;
    },
  });

  Object.defineProperty(slideshow, 'previousIndex', {
    configurable: true,
    get() {
      return this.current - 1;
    },
  });

  slideshow.addEventListener('keydown', (event) => {
    if (!(event.target instanceof Element)) return;
    const onControl =
      event.target === slideshow || event.target.closest('.product-recommendations-v2__arrow') != null;
    if (!onControl || typeof slideshow.next !== 'function') return;

    const rtl = getComputedStyle(slideshow).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';

    if (event.key === forward) {
      if (slideshow.refs?.next?.disabled) return;
      if (slideshow.current >= maxStartIndex(slideshow)) return;
      event.preventDefault();
      slideshow.next(event);
    } else if (event.key === backward) {
      if (slideshow.refs?.previous?.disabled) return;
      event.preventDefault();
      slideshow.previous(event);
    }
  });

  const refresh = () => refreshDisabled(slideshow);

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(refresh);
    observer.observe(slideshow);
  }

  customElements.whenDefined('slideshow-component').then(() => {
    requestAnimationFrame(refresh);
  });
}

/**
 * @param {ParentNode} root
 */
function scan(root) {
  if (!root || typeof root.querySelectorAll !== 'function') return;
  root.querySelectorAll(SELECTOR).forEach((element) => {
    if (element instanceof HTMLElement) patch(element);
  });
}

function boot() {
  scan(document);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches(SELECTOR)) patch(node);
        scan(node);
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('shopify:section:load', (event) => {
    if (event.target instanceof Element) scan(event.target);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
