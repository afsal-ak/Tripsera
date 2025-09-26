import { useParams } from 'react-router-dom';
import MessagePage from '@/components/chat/MessagePage';
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const MessageMainPage = () => {
    const { roomId } = useParams<{ roomId: string }>();

    const user = useSelector((state: RootState) => state.adminAuth.admin);
    if (!user) {
        return <div>Loading...</div>;
    }
    return (

        <div>
            <MessagePage
                roomId={roomId!}
                user={user}
            />
        </div>
    )
}

export default MessageMainPage
