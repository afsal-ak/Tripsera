import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getWallet } from '@/services/user/walletService';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import type { IWalletTransaction } from '@/types/IWallet';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Wallet } from 'lucide-react';

const WalletPage = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<IWalletTransaction[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const sort = (searchParams.get('sort') || 'newest') as 'newest' | 'oldest';
  const limit = 5;

  const handlePageChange = (page: number) => {
    setSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
    });
  };

  const handleSortChange = (newSort: 'newest' | 'oldest') => {
    setSearchParams({ page: '1', sort: newSort });
  };

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { balance, transactions, total } = await getWallet(currentPage, limit, sort);
        setBalance(balance);
        setTransactions(transactions);
        setTotalPages(Math.ceil(total / limit));
      } catch (error) {
        console.error('Failed to fetch wallet:', error);
      }
    };

    fetchWallet();
  }, [currentPage, sort]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Balance Card */}

      <Card className="shadow-md border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">Wallet Balance</CardTitle>
          <Wallet className="h-6 w-6 text-green-600" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">₹{balance}</p>
          <p className="text-sm text-muted-foreground mt-1">Available for transactions</p>
        </CardContent>
      </Card>

      {/* Transactions Container */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
          {/* Sort Buttons */}
          <div className="flex gap-2 mt-2 justify-end ">
            <Button
              variant={sort === 'newest' ? 'default' : 'outline'}
              onClick={() => handleSortChange('newest')}
              size="sm"
            >
              Newest
            </Button>
            <Button
              variant={sort === 'oldest' ? 'default' : 'outline'}
              onClick={() => handleSortChange('oldest')}
              size="sm"
            >
              Oldest
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
          {transactions.length > 0 ? (
            transactions.map((transaction, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b pb-2 last:border-none"
              >
                <div>
                  <p
                    className={`capitalize font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type}
                  </p>
                  {transaction.description && (
                    <p className="text-sm text-gray-500">{transaction.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{transaction.amount}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No transactions found.</p>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">{paginationButtons}</div>
    </div>
  );
};

export default WalletPage;
