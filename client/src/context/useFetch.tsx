import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { getErrorMessage } from "../api/client";

export interface UseFetchResult<T> {
  data: T | null;
  setData: Dispatch<SetStateAction<T | null>>;
  loading: boolean;
  error: string;
  refetch: () => void;
}

/**
 * Fetch data when the component mounts or when dependencies change.
 *
 * Example:
 *
 * const {
 *   data,
 *   loading,
 *   error,
 *   refetch,
 * } = useFetch(
 *   (signal) => staffApi.get(signal),
 * );
 *
 * You can also provide dependencies:
 *
 * useFetch(
 *   (signal) => staffApi.getByRestaurant(restaurantId, signal),
 *   [restaurantId],
 * );
 *
 * Features:
 * - Automatically fetches on mount
 * - Re-fetches when dependencies change
 * - Supports manual refetch()
 * - Cancels requests when the component unmounts
 * - Prevents state updates after an aborted request
 * - Keeps the latest fetcher without requiring it in the effect dependencies
 */
export default function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[] = [],
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  /*
   * Keep the latest fetcher in a ref.
   *
   * This prevents the fetcher function itself from causing
   * the effect to run repeatedly when it is recreated during
   * a render.
   */
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    const controller = new AbortController();

    async function executeFetch() {
      setLoading(true);
      setError("");

      try {
        const result = await fetcherRef.current(
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        setData(result);
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        setError(getErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void executeFetch();

    return () => {
      controller.abort();
    };

    /*
     * `fetcher` is intentionally excluded because the latest
     * version is stored in fetcherRef.
     *
     * refreshKey is included so refetch() triggers the request.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, ...deps]);

  const refetch = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    data,
    setData,
    loading,
    error,
    refetch,
  };
}

