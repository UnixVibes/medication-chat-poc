import { NextRequest, NextResponse } from 'next/server';
import { medicalLLM } from '@/lib/huggingface-client';
import { SUMMARY_PROMPT } from '@/lib/medical-prompts';
import { Message, DiagnosisSummary } from '@/types/chat';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Convert messages to conversation history
    const conversationHistory = messages
      .map((msg: Message) => `${msg.role === 'user' ? 'Patient' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    // Generate summary prompt
    const prompt = SUMMARY_PROMPT(conversationHistory);

    // Get summary from medical LLM
    const summaryResponse = await medicalLLM.generateSummary(prompt);

    // Try to parse as JSON, fallback to structured text
    let summary: DiagnosisSummary;
    try {
      const parsedSummary = JSON.parse(summaryResponse);
      summary = {
        symptoms: parsedSummary.symptoms || [],
        possibleConditions: parsedSummary.possibleConditions || [],
        recommendations: parsedSummary.recommendations || [],
        medications: parsedSummary.medications || [],
        followUpNeeded: parsedSummary.followUpNeeded || true,
        urgencyLevel: parsedSummary.urgencyLevel || 'medium'
      };
    } catch {
      // Fallback: extract information from text response
      summary = {
        symptoms: extractBulletPoints(summaryResponse, 'symptoms'),
        possibleConditions: extractBulletPoints(summaryResponse, 'conditions'),
        recommendations: ['Consult with a healthcare professional for proper evaluation'],
        medications: [],
        followUpNeeded: true,
        urgencyLevel: 'medium' as const
      };
    }

    return NextResponse.json({ summary });

  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json(
      { error: 'Unable to generate summary. Please try again.' },
      { status: 500 }
    );
  }
}

function extractBulletPoints(text: string, category: string): string[] {
  const lines = text.split('\n');
  const points: string[] = [];
  let inCategory = false;

  for (const line of lines) {
    if (line.toLowerCase().includes(category)) {
      inCategory = true;
      continue;
    }
    if (inCategory && (line.startsWith('-') || line.startsWith('•') || line.startsWith('*'))) {
      points.push(line.replace(/^[-•*]\s*/, '').trim());
    } else if (inCategory && line.trim() === '') {
      continue;
    } else if (inCategory && !line.startsWith('-') && !line.startsWith('•') && !line.startsWith('*')) {
      break;
    }
  }

  return points.length > 0 ? points : ['Information extracted from conversation'];
}