'use client';

import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading';
import type { ChatMessage } from '@/types';

interface AIChatProps {
  noteId: string;
}

export function AIChat({ noteId }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m here to help you understand this note about Machine Learning. Feel free to ask me any questions!',
      timestamp: new Date(),
      noteContext: noteId,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      noteContext: noteId,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `That's a great question about "${input}". Based on the note content, I can help explain this concept in more detail. Machine learning involves training algorithms on data to make predictions or decisions without being explicitly programmed for each task.`,
        timestamp: new Date(),
        noteContext: noteId,
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-96">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p>{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' 
                  ? 'text-blue-200' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                AI is thinking...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this note..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
          <PaperAirplaneIcon className="h-4 w-4" />
        </Button>
      </form>

      {/* Quick Questions */}
      <div className="mt-3 flex flex-wrap gap-1">
        {[
          'What is supervised learning?',
          'Explain overfitting',
          'Common algorithms?',
        ].map((question) => (
          <button
            key={question}
            onClick={() => setInput(question)}
            className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            disabled={isLoading}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}