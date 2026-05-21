// src/components/Chat/MessageItem.tsx
import React from 'react';
import styles from './MessageItem.module.css';
import type { IMessage, MessageOption } from './types';

interface MessageItemProps {
  message: IMessage;
  onOptionClick?: (option: MessageOption) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onOptionClick }) => {
  const isBot = message.sender === 'bot';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Ряд с аватаркой и облачком */}
      <div className={`${styles.messageRow} ${isBot ? styles.botRow : styles.userRow}`}>
        {isBot && (
          <div className={styles.avatar}>
            {/* Простая иконка пользователя/робота текстом */}
            <span>👤</span>
          </div>
        )}
        
        <div className={`${styles.bubble} ${isBot ? styles.botBubble : styles.userBubble}`}>
          {message.text}
        </div>

        {!isBot && (
          <div className={styles.avatar} style={{ backgroundColor: '#7f8c8d' }}>
            <span>👤</span>
          </div>
        )}
      </div>

      {/* Если у бота есть варианты ответов — рендерим кнопки */}
      {isBot && message.options && message.options.length > 0 && (
        <div className={styles.optionsWrapper}>
          {message.options.map((option) => (
            <button
              key={option.id}
              className={styles.optionButton}
              onClick={() => onOptionClick?.(option)}
            >
              {option.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};