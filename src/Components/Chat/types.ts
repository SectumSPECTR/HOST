// src/components/Chat/types.ts

// Тип для вариантов ответа, которые предлагает бот
export interface MessageOption {
  id: string | number;
  text: string;
}

// Главный интерфейс для любого сообщения в чате
export interface IMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: MessageOption[]; // Кнопки выбора (есть только у бота и не всегда)
}