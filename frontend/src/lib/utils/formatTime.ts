 import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatTimeAgo = (date: Date | string): string => {
  const now = dayjs();
  const reviewDate = dayjs(date);

  const daysAgo = now.diff(reviewDate, 'day');

  if (daysAgo <= 30) {
    return reviewDate.fromNow();
  }

  return reviewDate.format('MMM D, YYYY');
};
