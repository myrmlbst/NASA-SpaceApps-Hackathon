import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function percentile(arr, p) {
  if (arr.length === 0) return NaN;
  const a = [...arr].sort((x, y) => x - y);
  const idx = (p / 100) * (a.length - 1);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return a[lo];
  const t = idx - lo;
  return a[lo] * (1 - t) + a[hi] * t;
}

export function median(arr) {
  return percentile(arr, 50);
}

/**
 * Scale numbers to [0,1] for consistent bar heights.
 * - robust=true uses [p1, p99] to resist outliers
 * - falls back to min/max if needed
 */
export function scaleToUnit(arr, opts = {}) {
  const { robust = true, lowP = 1, highP = 99 } = opts;
  if (!arr?.length) return { scaled: [], lo: 0, hi: 1 };

  let lo = robust ? percentile(arr, lowP) : Math.min(...arr);
  let hi = robust ? percentile(arr, highP) : Math.max(...arr);

  // Fallback if degenerate or reversed
  if (!(isFinite(lo) && isFinite(hi)) || hi <= lo) {
    lo = Math.min(...arr);
    hi = Math.max(...arr);
  }
  if (hi <= lo) {
    // all values identical → draw mid-height bars
    return { scaled: arr.map(() => 0.5), lo, hi };
  }

  const scaled = arr.map(v => {
    const t = (v - lo) / (hi - lo);
    return Math.max(0, Math.min(1, t)); // clamp
  });

  return { scaled, lo, hi };
}

export function downsampleYToN(y, n, agg = 'mean') {
  const L = y.length;
  if (L === 0) return [];
  if (L <= n) return y.slice();

  const out = [];
  const step = L / n;

  for (let i = 0; i < n; i++) {
    const start = Math.floor(i * step);
    const end   = i === n - 1 ? L : Math.floor((i + 1) * step);
    let a = Infinity, b = -Infinity, sum = 0;

    for (let j = start; j < end; j++) {
      const v = y[j];
      sum += v; if (v < a) a = v; if (v > b) b = v;
    }
    const cnt = Math.max(1, end - start);
    out.push(agg === 'mean' ? (sum / cnt) : (agg === 'min' ? a : b));
  }
  return out;
}