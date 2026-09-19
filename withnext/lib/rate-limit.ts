interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const buckets = new Map<string, RateLimitEntry>();
const MAX_BUCKETS = 10_000;

function cleanup() {
	const now = Date.now();
	for (const [key, entry] of buckets) {
		if (entry.resetAt < now) buckets.delete(key);
	}
}

export function rateLimit(
	scope: string,
	ip: string,
	max: number,
	windowMs: number,
): { ok: boolean; remaining: number } {
	if (buckets.size > MAX_BUCKETS) cleanup();

	const now = Date.now();
	const key = `${scope}:${ip}`;
	const entry = buckets.get(key);

	if (!entry || entry.resetAt < now) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return { ok: true, remaining: max - 1 };
	}

	entry.count++;
	if (entry.count > max) {
		return { ok: false, remaining: 0 };
	}
	return { ok: true, remaining: max - entry.count };
}
