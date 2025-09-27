import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export class MedicalLLMClient {
  private modelId = 'aaditya/Llama3-OpenBioLLM-70B';

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await hf.textGeneration({
        model: this.modelId,
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.1,
          do_sample: true,
          return_full_text: false,
          stop: ['<|eot_id|>', '<|end_of_text|>']
        }
      });

      return response.generated_text || 'I apologize, but I cannot generate a response at this time. Please consult with a healthcare professional.';
    } catch (error) {
      console.error('Error calling Hugging Face API:', error);
      throw new Error('Unable to generate medical response. Please try again or consult a healthcare professional.');
    }
  }

  async generateSummary(prompt: string): Promise<string> {
    try {
      const response = await hf.textGeneration({
        model: this.modelId,
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.3,
          top_p: 0.8,
          repetition_penalty: 1.1,
          do_sample: true,
          return_full_text: false,
          stop: ['<|eot_id|>', '<|end_of_text|>']
        }
      });

      return response.generated_text || '{"error": "Unable to generate summary"}';
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Unable to generate medical summary.');
    }
  }
}

export const medicalLLM = new MedicalLLMClient();