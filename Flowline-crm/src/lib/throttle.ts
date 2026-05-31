const attempts: { count: number; resetAt: number } = {
  count: 0,
  resetAt: 0,
};

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 30_000;

export function throttleAuthAttempt(): { allowed: boolean; waitSeconds: number } {
  const now = Date.now();

  if (now > attempts.resetAt) {
    attempts.count = 0;
    attempts.resetAt = now + WINDOW_MS;
  }

  attempts.count++;

  if (attempts.count > MAX_ATTEMPTS) {
    const waitMs = attempts.resetAt - now;
    return { allowed: false, waitSeconds: Math.ceil(waitMs / 1000) };
  }

  return { allowed: true, waitSeconds: 0 };
}
