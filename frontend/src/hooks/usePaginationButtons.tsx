import { Button } from '@/components/ui/button';

interface UsePaginationButtonsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const usePaginationButtons = ({
  currentPage,
  totalPages,
  onPageChange,
}: UsePaginationButtonsProps) => {
  const buttons = [];

  // If there are no pages, return an empty array (no buttons)
  if (!totalPages || totalPages <= 1) {
    return [];
  }

  const pageLimit = 4;

  // Previous Button
  buttons.push(
    <Button
      key="prev"
      variant="outline"
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
    >
      Previous
    </Button>
  );

  // Show first 4 pages
  for (let i = 1; i <= Math.min(totalPages, pageLimit); i++) {
    buttons.push(
      <Button
        key={i}
        variant={i === currentPage ? 'default' : 'outline'}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Button>
    );
  }

  // Show ellipsis + last page if totalPages > 4
  if (totalPages > pageLimit) {
    buttons.push(
      <span key="dots" className="px-1 text-gray-400">
        ...
      </span>
    );

    buttons.push(
      <Button
        key={totalPages}
        variant={currentPage === totalPages ? 'default' : 'outline'}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </Button>
    );
  }

  // Next Button
  buttons.push(
    <Button
      key="next"
      variant="outline"
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
    >
      Next
    </Button>
  );

  return buttons;
};
