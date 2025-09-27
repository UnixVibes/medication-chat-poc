import { NextRequest, NextResponse } from 'next/server';
import { medicalLLM } from '@/lib/huggingface-client';
import {
  MEDICAL_CONVERSATION_PROMPT,
  checkForEmergencyKeywords,
  EMERGENCY_RESPONSE
} from '@/lib/medical-prompts';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check for emergency keywords
    if (checkForEmergencyKeywords(message)) {
      return NextResponse.json({
        response: EMERGENCY_RESPONSE
      });
    }

    // Generate prompt with conversation history
    const prompt = MEDICAL_CONVERSATION_PROMPT(message, conversationHistory || '');

    // Get response from medical LLM
    const response = await medicalLLM.generateResponse(prompt);

    return NextResponse.json({
      response: response
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: 'I apologize, but I encountered an error. Please try again or consult with a healthcare professional if this is urgent.',
        response: 'I apologize, but I encountered an error. Please try again or consult with a healthcare professional if this is urgent.'
      },
      { status: 500 }
    );
  }
}