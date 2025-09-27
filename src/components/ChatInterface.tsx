'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, AlertTriangle } from 'lucide-react';
import { Message, DiagnosisSummary } from '@/types/chat';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<string>;
  onGenerateSummary: (messages: Message[]) => Promise<DiagnosisSummary>;
}

export default function ChatInterface({ onSendMessage, onGenerateSummary }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisSummary, setDiagnosisSummary] = useState<DiagnosisSummary | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await onSendMessage(inputMessage);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or consult with a healthcare professional if this is urgent.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (messages.length < 2) return;

    setIsLoading(true);
    try {
      const summary = await onGenerateSummary(messages);
      setDiagnosisSummary(summary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Medical Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-800">
              <strong>Medical Disclaimer:</strong> This AI assistant provides general health information only.
              Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-semibold text-gray-800">Medical Consultation Assistant</h1>
          <p className="text-sm text-gray-600">Describe your symptoms and concerns</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Hello! I&apos;m here to help you understand your symptoms and provide general health guidance.</p>
              <p className="text-sm mt-2">Please describe how you&apos;re feeling or any symptoms you&apos;re experiencing.</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot className="h-4 w-4 mt-1 text-gray-500" />
                  )}
                  {message.role === 'user' && (
                    <User className="h-4 w-4 mt-1 text-white" />
                  )}
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4 text-gray-500" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Summary</h2>
          <button
            onClick={handleGenerateSummary}
            disabled={messages.length < 2 || isLoading}
            className="bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate
          </button>
        </div>

        {diagnosisSummary ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Reported Symptoms</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {diagnosisSummary.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Possible Conditions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {diagnosisSummary.possibleConditions.map((condition, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {condition}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Recommendations</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {diagnosisSummary.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {diagnosisSummary.medications.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Suggested Medications</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {diagnosisSummary.medications.map((med, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {med}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={`p-3 rounded-lg ${
              diagnosisSummary.urgencyLevel === 'high' ? 'bg-red-50 border border-red-200' :
              diagnosisSummary.urgencyLevel === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-green-50 border border-green-200'
            }`}>
              <h3 className="font-medium text-gray-700 mb-1">Urgency Level</h3>
              <span className={`text-sm font-medium ${
                diagnosisSummary.urgencyLevel === 'high' ? 'text-red-600' :
                diagnosisSummary.urgencyLevel === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {diagnosisSummary.urgencyLevel.toUpperCase()}
              </span>
              {diagnosisSummary.followUpNeeded && (
                <p className="text-sm text-gray-600 mt-1">Follow-up appointment recommended</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <p>Chat with the assistant to generate a medical summary</p>
          </div>
        )}
      </div>
    </div>
  );
}