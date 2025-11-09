import { NextRequest } from "next/server";
import { createJsonBin, readJsonBin, updateJsonBin } from "@/lib/jsonbin";

interface StoreRequestBody<T = unknown> {
  binId?: string;
  payload: T;
  binName?: string;
  collectionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as StoreRequestBody;

    if (typeof body !== "object" || body === null) {
      return Response.json(
        { message: "Request body must be a JSON object." },
        { status: 400 }
      );
    }

    const { binId, payload, binName, collectionId } = body;

    if (typeof payload === "undefined") {
      return Response.json(
        { message: "Missing payload field in request body." },
        { status: 400 }
      );
    }

    const response = binId
      ? await updateJsonBin(binId, payload, { binName, collectionId })
      : await createJsonBin(payload, { binName, collectionId });

    return Response.json(response);
  } catch (error) {
    console.error("Failed to persist data to JSONBin", error);

    return Response.json(
      {
        message: "Unable to persist data to JSONBin.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const binId = searchParams.get("binId");

    if (!binId) {
      return Response.json(
        { message: "binId query parameter is required." },
        { status: 400 }
      );
    }

    const response = await readJsonBin(binId);

    return Response.json(response);
  } catch (error) {
    console.error("Failed to read data from JSONBin", error);

    return Response.json(
      {
        message: "Unable to read data from JSONBin.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
