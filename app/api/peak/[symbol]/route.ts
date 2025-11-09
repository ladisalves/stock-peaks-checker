import { getPriceAlert } from "@/lib/getPriceAler";
import { readJsonBin, updateJsonBin } from "@/lib/jsonbin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  if (!symbol) {
    return new Response("Symbol parameter is missing", { status: 400 });
  }

  const apiKey = process.env.TWELVEDATA_API_KEY;

  if (!apiKey) {
    return new Response("API key is not configured", { status: 500 });
  }

  const apiResponse = await fetch(
    `https://api.twelvedata.com/price?symbol=${encodeURIComponent(
      symbol
    )}&apikey=${apiKey}`
  );

  if (!apiResponse.ok) {
    return new Response("Failed to fetch price data", { status: 502 });
  }

  const body = await apiResponse.json();
  const currentPrice = parseFloat(body.price);

  if (isNaN(currentPrice)) {
    return new Response("Invalid price data received", { status: 502 });
  }

  const previousPriceStorage = await readJsonBin<{
    previousPrice: Record<string, number>;
  }>(process.env.JSONBIN_ID || "");
  const previousPrice =
    previousPriceStorage?.record?.previousPrice?.[symbol] || 0;
  await updateJsonBin(process.env.JSONBIN_ID || "", {
    previousPrice: {
      ...previousPriceStorage?.record?.previousPrice,
      [symbol]: currentPrice,
    },
  });

  return new Response(
    JSON.stringify({
      price: currentPrice,
      previousPrice: previousPrice,
      alert: getPriceAlert(
        currentPrice,
        previousPrice,
        parseInt(process.env.PRICE_CHANGE_THRESHOLD ?? "5")
      ),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
