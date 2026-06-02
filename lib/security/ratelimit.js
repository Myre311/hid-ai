/**
 * Rate limiting in-memory simple — sliding window.
 *
 * Variante du module hidai-platform/lib/security/ratelimit.js — clone
 * intentionnel pour ne pas créer de dépendance cross-projet.
 *
 * Pour la prod scalable : à remplacer par @upstash/ratelimit + Upstash Redis.
 */

import { NextResponse } from "next/server";

const buckets = new Map();
let lastGc = Date.now();

function maybeGc(now) {
  if (now - lastGc < 5 * 60 * 1000) return;
  lastGc = now;
  const cutoff = now - 60 * 60 * 1000;
  for (const [key, ts] of buckets.entries()) {
    const last = ts[ts.length - 1];
    if (last < cutoff) buckets.delete(key);
  }
}

export function checkRateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  maybeGc(now);

  const cutoff = now - windowMs;
  let ts = buckets.get(key) || [];
  ts = ts.filter((t) => t > cutoff);

  if (ts.length >= limit) {
    const oldest = ts[0];
    const resetAt = oldest + windowMs;
    return {
      ok: false,
      remaining: 0,
      resetAt,
      retryAfterSec: Math.max(1, Math.ceil((resetAt - now) / 1000)),
    };
  }

  ts.push(now);
  buckets.set(key, ts);

  return {
    ok: true,
    remaining: limit - ts.length,
    resetAt: now + windowMs,
  };
}

export function rateLimitResponse(rl) {
  return NextResponse.json(
    {
      error: "rate_limit_exceeded",
      retry_after_sec: rl.retryAfterSec,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(rl.retryAfterSec || 60),
        "X-RateLimit-Limit": "0",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
      },
    }
  );
}

export function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

export const PRESETS = {
  publicForm:    { limit: 5,   windowMs: 60_000 },
  publicAuth:    { limit: 5,   windowMs: 60_000 },
};
