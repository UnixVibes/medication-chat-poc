'use client';

import ChatInterface from '@/components/ChatInterface';
import { Message, DiagnosisSummary } from '@/types/chat';

export default function Home() {
  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: '' // You can implement conversation history here
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const handleGenerateSummary = async (messages: Message[]): Promise<DiagnosisSummary> => {
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  };

  return (
    <main className="h-screen">
      <ChatInterface
        onSendMessage={handleSendMessage}
        onGenerateSummary={handleGenerateSummary}
      />
    </main>
  );
}
