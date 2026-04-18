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
const CAPACITY = 500;
const BONUS_QUOTA = 100;
const FALLBACK_REGISTERED = 204;

const getStartOfCurrentMonthJakarta = (): string => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Jakarta",
    });

    const parts = formatter.formatToParts(new Date());
    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;

    if (!year || !month) {
        return `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-01`;
    }

    return `${year}-${month}-01`;
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
                date_start: getStartOfCurrentMonthJakarta(),
            }),
        });

        if (!response.ok) {
            throw new Error(`PMB API responded with status ${response.status}`);
        }

        const json = (await response.json()) as PmbCamabaCountResponse;
        const totalPendaftar = json.meta?.statistics?.total_pendaftar;

        if (typeof totalPendaftar === "number" && Number.isFinite(totalPendaftar)) {
            registered = totalPendaftar;
        } else if (Array.isArray(json.data)) {
            registered = json.data.length;
        }
    } catch (error) {
        console.error("Failed to fetch PMB camaba count:", error);
    }

    const available = Math.max(CAPACITY - registered + BONUS_QUOTA, 0);

    const data = {
        updateDate,
        registered,
        capacity: CAPACITY,
        bonusQuota: BONUS_QUOTA,
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
