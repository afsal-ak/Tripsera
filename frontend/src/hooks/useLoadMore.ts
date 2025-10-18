import { useState } from 'react';

interface UseLoadMoreProps {
  totalPages: number;
  initialPage?: number;
  onLoad: (page: number) => Promise<void>;
}

export const useLoadMore = ({ totalPages, initialPage = 1, onLoad }: UseLoadMoreProps) => {
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      await onLoad(nextPage);
      setPage(nextPage);

      if (nextPage >= totalPages) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return { page, loadMore, hasMore, loadingPage: loading };
};
