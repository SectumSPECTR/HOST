// src/components/Chat/Chat.tsx
import React, { useState, useRef, useEffect } from 'react'; // Добавили useRef и useEffect
import { MessageItem } from './MessageItem';
import styles from './Chat.module.css';
import type { IMessage, MessageOption } from './types';
import botAvatar from '../../assets/bot-avatar.png';

// Оставляем только самое первое приветственное сообщение бота как начальное
const INITIAL_MESSAGES: IMessage[] = [
  {
    id: 'msg-1',
    sender: 'bot',
    text: 'Добро пожаловать! Выберите цель обращения. Введите 1 или 2.',
    options: [
      { id: 'opt-1', text: '1. Только спросить' },
      { id: 'opt-2', text: '2. Записаться на прием' }
    ]
  }
];

export const Chat: React.FC = () => {
  // Состояние для хранения всех сообщений в чате
  const [messages, setMessages] = useState<IMessage[]>(INITIAL_MESSAGES);
  // Состояние для текста в поле ввода
  const [inputValue, setInputValue] = useState('');
  // Новое состояние: индикатор того, что бот генерирует ответ
  const [isTyping, setIsTyping] = useState(false);

  // Создаем реф (маяк) для привязки к нижнему элементу в контейнере сообщений
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Функция автоматического скролла к маяку
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Вызываем скролл каждый раз, когда меняется массив сообщений или статус печати бота
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Функция для отправки сообщения от пользователя
  const sendMessage = (text: string) => {
    if (!text.trim()) return; // Не отправляем пустые сообщения

    // 1. Создаем новое сообщение пользователя
    const userMessage: IMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
    };

    // 2. Добавляем его в state
    setMessages((prev) => [...prev, userMessage]);

    // 3. Очищаем поле ввода
    setInputValue('');

    // Включаем статус "печатает..." перед запуском таймера бота
    setIsTyping(true);

    // Имитируем ответ бота через 1 секунду (в будущем тут будет запрос к MedGemma)
    simulateBotResponse(text);
  };

  // Хэндлер для отправки через инпут (нажатие Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage(inputValue);
    }
  };

  // Хэндлер для клика по интерактивным кнопкам бота
  const handleOptionClick = (option: MessageOption) => {
    // При клике на кнопку отправляем её текст как сообщение пользователя
    sendMessage(option.text);
  };

  // Временная функция-заглушка для имитации логики бота
  const simulateBotResponse = (userText: string) => {
    setTimeout(() => {
      let botText = 'Я изучаю ваш запрос...';
      let options: MessageOption[] | undefined = undefined;

      // Простая проверка: если пользователь выбрал "2. Записаться на прием" или написал "2"
      if (userText.includes('2')) {
        botText = 'Оцените ваше текущее состояние. Введите цифру (1, 2, 3 или 4)';
        options = [
          { id: 'state-1', text: '1. Критические симптомы' },
          { id: 'state-2', text: '2. Тяжелое состояние' },
          { id: 'state-3', text: '3. Среднее состояние' },
          { id: 'state-4', text: '4. Легкое состояние' }
        ];
      } else if (userText.includes('4')) {
        botText = 'Для продолжения необходимо согласие на обработку персональных данных. Вы согласны? (да/нет):';
      } else if (userText.toLowerCase() === 'да') {
        botText = 'Спасибо! Передаю данные МедГемме для анализа симптомов. Опишите, что именно вас беспокоит?';
      }

      const botMessage: IMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botText,
        options: options
      };

      setMessages((prev) => [...prev, botMessage]);
      // Выключаем статус "печатает...", так как ответ пришел
      setIsTyping(false);
    }, 1000); // Задержка в 1 секунду для реалистичности
  };

  return (
    <div className={styles.wrapper}>
      {/* Шапка */}
      <header className={styles.header}>
        <img src={botAvatar} alt="МедАссистент" className={styles.avatarImg} />
        <div className={styles.headerInfo}>
          <h3>МедАссистент</h3>
          <p>бот · {isTyping ? 'печатает...' : 'онлайн'}</p>
        </div>
      </header>

      {/* Область сообщений */}
      <div className={styles.messagesContainer}>
        <p style={{ textAlign: 'center', color: 'gray', fontSize: '12px', marginBottom: '10px' }}>Сегодня</p>
        
        {messages.map((msg) => (
          <MessageItem 
            key={msg.id} 
            message={msg} 
            onOptionClick={handleOptionClick} 
          />
        ))}

        {/* Пустой элемент-маркер, до которого контейнер будет автоматически прокручиваться */}
        <div ref={messagesEndRef} />
      </div>

      {/* Панель ввода */}
      <div className={styles.inputArea}>
        <input 
          className={styles.input} 
          type="text" 
          placeholder="Введите сообщение..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};