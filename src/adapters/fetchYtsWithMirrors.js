import API_BASE_URL, { YTS_API_MIRRORS } from "../config";

const DEFAULT_TIMEOUT = 20000;

const buildMirrorList = () => {
  const list = [API_BASE_URL, ...YTS_API_MIRRORS];
  return [...new Set(list)];
};

const fetchWithTimeout = async (url, timeoutMs) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
};

const fetchYtsWithMirrors = async (path, timeoutMs = DEFAULT_TIMEOUT) => {
  const mirrors = buildMirrorList();
  let lastError = null;

  for (let i = 0; i < mirrors.length; i += 1) {
    const base = mirrors[i];
    try {
      return await fetchWithTimeout(`${base}${path}`, timeoutMs);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("All YTS mirrors failed");
};

export default fetchYtsWithMirrors;
