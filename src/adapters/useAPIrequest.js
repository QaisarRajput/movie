import axios from "axios";
import { useEffect, useState } from "react";
import { YTS_API_MIRRORS } from "../config";

const CACHE_TTL = 10 * 60 * 1000;
const CACHE_PREFIX = "movieApp_api_cache:";
const LAST_WORKING_MIRROR_KEY = "movieApp_yts_last_mirror";

const getCache = (key) => {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch (e) {
    return null;
  }
};

const setCache = (key, data) => {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ ts: Date.now(), data }),
    );
  } catch (e) {
    // Ignore storage failures.
  }
};

const getCandidates = (url) => {
  const ytsMatch = url.match(/^https?:\/\/[^/]+\/api\/v2(\/.*)$/i);
  if (!ytsMatch) {
    return [{ url, mirrorBase: null }];
  }

  const suffix = ytsMatch[1];
  let orderedMirrors = [...YTS_API_MIRRORS];

  try {
    const lastWorking = localStorage.getItem(LAST_WORKING_MIRROR_KEY);
    if (lastWorking && orderedMirrors.includes(lastWorking)) {
      orderedMirrors = [
        lastWorking,
        ...orderedMirrors.filter((mirror) => mirror !== lastWorking),
      ];
    }
  } catch (e) {
    // Ignore storage failures.
  }

  return orderedMirrors.map((mirrorBase) => ({
    url: mirrorBase + suffix,
    mirrorBase,
  }));
};

const useAPIrequest = (APIconString) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!APIconString) {
      setResponse(null);
      setError(null);
      setLoading(false);
      return;
    }

    const source = axios.CancelToken.source();

    makeGETRequest(APIconString, source);

    return () => {
      source.cancel();
    };
  }, [APIconString]);

  const makeGETRequest = async (con, source) => {
    setLoading(true);
    setError(null);

    const cached = getCache(con);
    if (cached) {
      setResponse(cached);
      setLoading(false);
      return;
    }

    const candidates = getCandidates(con);

    try {
      let resolved = null;

      for (let i = 0; i < candidates.length; i += 1) {
        const candidate = candidates[i];
        try {
          const res = await axios.get(candidate.url, {
            cancelToken: source.token,
            timeout: 20000,
          });
          resolved = res.data;

          if (candidate.mirrorBase) {
            try {
              localStorage.setItem(LAST_WORKING_MIRROR_KEY, candidate.mirrorBase);
            } catch (e) {
              // Ignore storage failures.
            }
          }
          break;
        } catch (candidateError) {
          if (axios.isCancel(candidateError)) {
            throw candidateError;
          }
        }
      }

      if (!resolved) {
        throw new Error("All API mirrors failed");
      }

      setResponse(resolved);
      setCache(con, resolved);
    } catch (e) {
      if (!axios.isCancel(e)) {
        setError(e);
      }
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading };
};

export default useAPIrequest;
