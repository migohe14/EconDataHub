import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'; // Necesitas instalar esto
import { HumanMessage } from '@langchain/core/messages';
import * as dotenv from 'dotenv';
import { SeriesSummary } from './aggregator.model';

dotenv.config();

@Injectable()
export class AnalysisService {
  private openaiLlm: ChatOpenAI;
  private geminiLlm: ChatGoogleGenerativeAI;
  private readonly logger = new Logger(AnalysisService.name);

  constructor() {
    // Inicialización de OpenAI
    this.openaiLlm = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
      temperature: 0.2,
      maxRetries: 0, // Desactivamos reintentos automáticos para saltar rápido al fallback
    });

    // Inicialización de Gemini
    this.geminiLlm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY, // Añade esta variable en Render
      modelName: 'gemini-2.5-flash',
      temperature: 0.2,
    });
  }

  async analyzeData(
    query: string,
    data: Record<string, SeriesSummary>,
  ): Promise<string> {
    const dataAsString = JSON.stringify(data, null, 2);

    const prompt = `
    You are an expert financial analyst. Your task is to analyze the provided summary of economic indicators and answer the user's question based on it. Your response must be in Spanish.

      The data is a JSON object where each key is a series ID and the value is an object containing:
      - "indicator": The name of the economic indicator.
      - "unit": The unit of measurement for the indicator (e.g., "percentage"). This field is optional.
      - "country": The country or region for the indicator.
      - "latest_value": The most recent value of the indicator, corresponding to "observation_end".
      - "previous_value": The value from the start of the period, corresponding to "observation_start".
      - "change": The absolute change between the latest and previous value.
      - "change_pct": The percentage change over the period.
      - "observation_start": The start date for the data period.
      - "observation_end": The end date for the data period.

      User's Question: "${query}"

      Data:
      \`\`\`json
      ${dataAsString}
      \`\`\`

      Provide a concise and clear analysis based only on the data provided. When mentioning values, include their dates ("observation_start" and "observation_end") for context.
    `;

    const messages = [new HumanMessage(prompt)];

    try {
      // Intento 1: OpenAI
      this.logger.log('Intentando análisis con OpenAI...');
      const result = await this.openaiLlm.invoke(messages);
      return result.content.toString();
    } catch (error) {
      // Si falla OpenAI (por cuota o cualquier error), entramos aquí
      this.logger.error('OpenAI falló (posible falta de cuota). Cambiando a Gemini...');
      
      try {
        // Intento 2: Gemini
        const result = await this.geminiLlm.invoke(messages);
        return result.content.toString();
      } catch (geminiError) {
        this.logger.error('Gemini también falló.');
        return 'Lo siento, los servicios de análisis no están disponibles en este momento por límites de cuota.';
      }
    }
  }
}
