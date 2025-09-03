// src/data/mockChats.ts
export const mockChats = [
  {
    _id: "1",
    name: "John Doe",
    profileImage: "https://i.pravatar.cc/150?img=1",
    lastMessageContent: "Hey! How are you?",
    unread: 2,
    updatedAt: new Date(),
    messages: [
      { id: "m1", sender: "self", content: "Hey John!", createdAt: new Date() },
      { id: "m2", sender: "John Doe", content: "Hey! How are you?", createdAt: new Date() },
    ],
  },
  {
    _id: "2",
    name: "Alice Smith",
    profileImage: "https://i.pravatar.cc/150?img=2",
    lastMessageContent: "Let's meet tomorrow!",
    unread: 0,
    updatedAt: new Date(),
    messages: [
      { id: "m1", sender: "self", content: "Sure, Alice!", createdAt: new Date() },
      { id: "m2", sender: "Alice Smith", content: "Let's meet tomorrow!", createdAt: new Date() },
    ],
  },
];
