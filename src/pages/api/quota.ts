import type { APIRoute } from "astro";

export const prerender = false;

interface PmbCamabaCountResponse {
    data?: unknown[];
    meta?: {
        statistics?: {
            total_pendaftar?: number;
        };
    };
}

const PMB_CAMABA_COUNT_API = "https://pmb.stekom.ac.id/api/pmb/list-data-camaba-count";
const PMB_BEARER_TOKEN =
    import.meta.env.PMB_API_BEARER_TOKEN ??
    "8|aL0DhDhcgqh4P7uQNa3sz1ylBzdaQzTIhCuHaUYV9073c0e9";

const YEAR_START = "2026-01-01";
const INITIAL_CAPACITY = 3500;
const REFILL_THRESHOLD = 100;
const REFILL_AMOUNT = 200;
const FALLBACK_REGISTERED = 31;

const getTodayJakarta = (): string => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Jakarta",
    });

    const parts = formatter.formatToParts(new Date());
    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;

    if (!year || !month || !day) {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }

    return `${year}-${month}-${day}`;
};

// Capacity starts at INITIAL_CAPACITY and grows by REFILL_AMOUNT every time
// the remaining slots would otherwise drop to/below REFILL_THRESHOLD.
const resolveCapacity = (registered: number): number => {
    let capacity = INITIAL_CAPACITY;
    while (capacity - registered <= REFILL_THRESHOLD) {
        capacity += REFILL_AMOUNT;
    }
    return capacity;
};

export const GET: APIRoute = async () => {
    const updateDate = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
    })
        .format(new Date())
        .toUpperCase();

    // Fetch real registered count from API (year-to-date: Jan 1 -> today)
    let registered = FALLBACK_REGISTERED;
    try {
        const response = await fetch(PMB_CAMABA_COUNT_API, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${PMB_BEARER_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date_start: YEAR_START,
                date_end: getTodayJakarta(),
            }),
        });

        if (response.ok) {
            const json = (await response.json()) as PmbCamabaCountResponse;
            const totalPendaftar = json.meta?.statistics?.total_pendaftar;

            if (typeof totalPendaftar === "number" && Number.isFinite(totalPendaftar)) {
                registered = totalPendaftar;
            } else if (Array.isArray(json.data)) {
                registered = json.data.length;
            }
        }
    } catch (error) {
        console.error("Failed to fetch PMB camaba count:", error);
    }

    const capacity = resolveCapacity(registered);
    const available = Math.max(capacity - registered, 0);

    const data = {
        updateDate,
        registered,
        capacity,
        available,
    };

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
        },
    });
};
