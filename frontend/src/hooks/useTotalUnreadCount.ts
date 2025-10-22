import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { useEffect } from 'react';
import { userTotalChatUnreadCount } from '@/services/user/messageService';
import { adminTotalChatUnreadCount } from '@/services/admin/messageService';
import { setTotalUnread } from '@/redux/slices/chatRoomSlice';
import { EnumUserRole } from '@/Constants/enums/userEnum';

export function useTotalUnreadCount(role: EnumUserRole) {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Get total unread count from Redux
  const totalUnread = useSelector((state: RootState) => state.chatRoom.totalUnread);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        let res;

        // ✅ Fetch based on role
        if (role === EnumUserRole.ADMIN) {
          res = await adminTotalChatUnreadCount();
        } else {
          res = await userTotalChatUnreadCount();
        }

        // ✅ Update Redux state
        dispatch(setTotalUnread(res.data || 0));
      } catch (error) {
        console.error('❌ Failed to fetch total unread count:', error);
      }
    };

  //  if (role) {
      fetchUnread();
  //  }
  }, [dispatch, role]);

  return totalUnread;
}
