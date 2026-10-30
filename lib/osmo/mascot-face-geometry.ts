/** Geometry helpers for mascot eye / highlight clamping (SVG user units). */

export type PercentCaps = { xPercent: number; yPercent: number };

function unionPathBoxes(paths: SVGGraphicsElement[]): DOMRect | null {
  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  for (const p of paths) {
    const b = p.getBBox();
    if (!b.width && !b.height) continue;
    x1 = Math.min(x1, b.x);
    y1 = Math.min(y1, b.y);
    x2 = Math.max(x2, b.x + b.width);
    y2 = Math.max(y2, b.y + b.height);
  }
  if (!Number.isFinite(x1)) return null;
  return new DOMRect(x1, y1, x2 - x1, y2 - y1);
}

function nearestEyePath(
  hiPath: SVGGraphicsElement,
  eyePaths: SVGGraphicsElement[]
): SVGGraphicsElement | null {
  if (!eyePaths.length) return null;
  const hiCx = hiPath.getBBox().x + hiPath.getBBox().width / 2;
  let best = eyePaths[0]!;
  let bestD = Infinity;
  for (const ep of eyePaths) {
    const b = ep.getBBox();
    const cx = b.x + b.width / 2;
    const d = Math.abs(cx - hiCx);
    if (d < bestD) {
      bestD = d;
      best = ep;
    }
  }
  return best;
}

/** Max |xPercent|/|yPercent| for #innereyes so glints stay inside paired black eyes. */
export function measureHighlightPercentCaps(section: Element): PercentCaps | null {
  const inner = section.querySelector("#innereyes") as SVGGraphicsElement | null;
  const eyes = section.querySelector("#eyes_2");
  if (!inner || !eyes) return null;

  const innerBox = inner.getBBox();
  if (innerBox.width < 1 || innerBox.height < 1) return null;

  const eyePaths = [...eyes.querySelectorAll(":scope > path")] as SVGGraphicsElement[];
  const hiPaths = [...inner.querySelectorAll("path")] as SVGGraphicsElement[];
  if (!eyePaths.length || !hiPaths.length) return null;

  let capX = Infinity;
  let capY = Infinity;
  const inset = 0.2;

  for (const hiPath of hiPaths) {
    const hiB = hiPath.getBBox();
    const eyePath = nearestEyePath(hiPath, eyePaths);
    if (!eyePath) continue;
    const eyeB = eyePath.getBBox();
    const marginX = eyeB.width * inset;
    const marginY = eyeB.height * inset;
    const allowedX = Math.max(0, (eyeB.width - marginX * 2 - hiB.width) / 2);
    const allowedY = Math.max(0, (eyeB.height - marginY * 2 - hiB.height) / 2);
    capX = Math.min(capX, (allowedX / innerBox.width) * 100);
    capY = Math.min(capY, (allowedY / innerBox.height) * 100);
  }

  if (!Number.isFinite(capX) || !Number.isFinite(capY)) return null;

  return {
    xPercent: capX * 0.72,
    yPercent: capY * 0.72,
  };
}

export function clampPercent(value: number, cap: number): number {
  if (cap <= 0) return 0;
  return Math.max(-cap, Math.min(cap, value));
}

type Rect = { left: number; top: number; right: number; bottom: number };

function insetRect(r: DOMRect, px: number): Rect {
  return {
    left: r.left + px,
    top: r.top + px,
    right: r.right - px,
    bottom: r.bottom - px,
  };
}

function pointInRect(x: number, y: number, r: Rect): boolean {
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

/** Playwright / runtime check: every highlight path corner lies inside a black eye path rect. */
export function highlightsContainedInEyes(root: Element, insetPx = 1.5): boolean {
  const eyes = root.querySelector("#eyes_2");
  const inner = root.querySelector("#innereyes");
  if (!eyes || !inner) return false;

  const eyeRects = [...eyes.querySelectorAll(":scope > path")].map((p) =>
    insetRect(p.getBoundingClientRect(), insetPx)
  );
  if (!eyeRects.length) return false;

  for (const hp of inner.querySelectorAll("path")) {
    const hr = hp.getBoundingClientRect();
    const corners = [
      [hr.left, hr.top],
      [hr.right, hr.top],
      [hr.left, hr.bottom],
      [hr.right, hr.bottom],
    ] as const;
    for (const [x, y] of corners) {
      if (!eyeRects.some((er) => pointInRect(x, y, er))) return false;
    }
  }
  return true;
}
