# Medical Chat Assistant

A Next.js application that provides a medical consultation chat interface powered by the Llama3-OpenBioLLM-70B model from Hugging Face.

## Features

- **Patient Chat Interface**: Clean, intuitive chat interface for patients to describe symptoms
- **AI Medical Assistant**: Powered by Llama3-OpenBioLLM-70B for medical consultations
- **Medical Safety Guardrails**: Built-in safety measures and emergency detection
- **Diagnosis Summarization**: Automatic generation of symptoms, possible conditions, and recommendations
- **Medical Disclaimers**: Clear disclaimers that this is for information only, not diagnosis
- **Emergency Detection**: Automatic detection of emergency keywords with immediate guidance

## Safety Features

- Emergency keyword detection (chest pain, difficulty breathing, etc.)
- Medical disclaimers prominently displayed
- Recommendations to consult healthcare professionals
- No specific medication dosages or prescriptions
- Urgency level assessment
- Clear boundaries between AI assistance and medical diagnosis

## Setup

1. **Clone and Install Dependencies**:
   ```bash
   cd medical-chat-app
   npm install
   ```

2. **Environment Setup**:
   - Copy `.env.local` and add your Hugging Face API key
   - Get a free API key from: https://huggingface.co/settings/tokens
   ```bash
   HUGGINGFACE_API_KEY=your_actual_api_key_here
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Open Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Chat API endpoint
│   │   └── summary/route.ts       # Summary generation API
│   └── page.tsx                   # Main application page
├── components/
│   └── ChatInterface.tsx          # Main chat component
├── lib/
│   ├── huggingface-client.ts      # Hugging Face API integration
│   └── medical-prompts.ts         # Medical prompts and guardrails
└── types/
    └── chat.ts                    # TypeScript types
```

## Medical Model

This application uses the **Llama3-OpenBioLLM-70B** model from Hugging Face:
- Model ID: `aaditya/Llama3-OpenBioLLM-70B`
- Specialized for medical and biomedical tasks
- Provides medical information while maintaining safety guardrails

## Medical Guardrails

The application includes several safety measures:

1. **Emergency Detection**: Automatic detection of emergency symptoms
2. **Medical Disclaimers**: Clear warnings about AI limitations
3. **Professional Consultation**: Regular recommendations to see healthcare providers
4. **No Prescriptions**: Never provides specific medications or dosages
5. **Symptom Urgency**: Assesses urgency levels (low/medium/high)

## Important Disclaimers

⚠️ **Medical Disclaimer**: This AI assistant provides general health information only. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.

⚠️ **Emergency**: If you're experiencing a medical emergency, call emergency services immediately.

⚠️ **Not a Doctor**: This application is not a substitute for professional medical advice, diagnosis, or treatment.

## Development

- Built with Next.js 15 and TypeScript
- Styled with Tailwind CSS
- Icons from Lucide React
- Hugging Face Inference API for model access

## License

This project is for educational and demonstration purposes only.
