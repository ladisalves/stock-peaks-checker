const JSONBIN_BASE_URL = "https://api.jsonbin.io/v3";

export interface JsonBinMetadata {
  id: string;
  private: boolean;
  createdAt: string;
  updatedAt?: string;
  name?: string;
}

export interface JsonBinResponse<T> {
  record: T;
  metadata: JsonBinMetadata;
}

interface JsonBinRequestOptions {
  binName?: string;
  collectionId?: string;
}

function getApiKey(): string {
  const apiKey = process.env.JSONBIN_API_KEY;

  if (!apiKey) {
    throw new Error(
      "JSONBIN_API_KEY environment variable is missing. Add it to your environment to enable persistence."
    );
  }

  return apiKey;
}

function getMasterKey(): string {
  const apiKey = process.env.JSONBIN_MASTER_KEY;

  if (!apiKey) {
    throw new Error(
      "JSONBIN_MASTER_KEY environment variable is missing. Add it to your environment to enable persistence."
    );
  }

  return apiKey;
}

async function jsonbinFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const apiKey = getApiKey();
  const masterKey = getMasterKey();

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  headers.set("X-Master-Key", masterKey);
  headers.set("X-Access-Key", apiKey);

  const response = await fetch(`${JSONBIN_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `JSONBin request failed with status ${response.status}: ${errorText}`
    );
  }

  return response.json();
}

export async function createJsonBin<T>(
  record: T,
  { binName, collectionId }: JsonBinRequestOptions = {}
): Promise<JsonBinResponse<T>> {
  const headers = new Headers();

  if (binName) {
    headers.set("X-Bin-Name", binName);
  }

  if (collectionId) {
    headers.set("X-Collection-Id", collectionId);
  }

  return jsonbinFetch<JsonBinResponse<T>>("/b", {
    method: "POST",
    headers,
    body: JSON.stringify(record),
    cache: "no-store",
  });
}

export async function updateJsonBin<T>(
  binId: string,
  record: T,
  { binName, collectionId }: JsonBinRequestOptions = {}
): Promise<JsonBinResponse<T>> {
  if (!binId) {
    throw new Error("binId is required to update a JSONBin record");
  }

  const headers = new Headers();

  if (binName) {
    headers.set("X-Bin-Name", binName);
  }

  if (collectionId) {
    headers.set("X-Collection-Id", collectionId);
  }

  return jsonbinFetch<JsonBinResponse<T>>(`/b/${binId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(record),
    cache: "no-store",
  });
}

export async function readJsonBin<T>(
  binId: string
): Promise<JsonBinResponse<T>> {
  if (!binId) {
    throw new Error("binId is required to read a JSONBin record");
  }

  return jsonbinFetch<JsonBinResponse<T>>(`/b/${binId}/latest`, {
    method: "GET",
    cache: "no-store",
  });
}
