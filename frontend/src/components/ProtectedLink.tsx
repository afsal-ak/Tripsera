import { Link, type LinkProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuthModal } from '@/context/AuthModalContext';
import type { RootState } from '@/redux/store';
import { useAppSnackbar } from '@/hooks/useSnackbar';

interface ProtectedLinkProps extends LinkProps {
    requireAuth?: boolean;
}

const ProtectedLink = ({ requireAuth = false, onClick, ...props }: ProtectedLinkProps) => {
    const snackbar = useAppSnackbar();

    const { isAuthenticated, user } = useSelector((state: RootState) => state.userAuth);
    const { openLogin } = useAuthModal();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const isAllowed = isAuthenticated && !user?.isBlocked;

        if (requireAuth && !isAllowed) {
            snackbar.error('Please login to continue')
            e.preventDefault(); // 🚫 STOP navigation
            openLogin();        // 🔥 OPEN modal
            return;
        }
        onClick?.(e);
    };

    return <Link {...props} onClick={handleClick} />;
};

export default ProtectedLink;