import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import * as dotenv from 'dotenv';
import { SeriesSummary } from './aggregator.model';

dotenv.config();

@Injectable()
export class AnalysisService {
  private llm: ChatOpenAI;

  constructor() {
    // Inicializa el modelo de lenguaje. Puedes ajustar la temperatura para controlar la creatividad.
    this.llm = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini', // Un modelo rápido y económico, ideal para empezar
      temperature: 0.2,
    });
  }

  /**
   * Analiza un conjunto de datos utilizando un LLM.
   * @param query La pregunta del usuario en lenguaje natural.
   * @param data Los datos a analizar (por ejemplo, observaciones de series de tiempo).
   * @returns Una respuesta generada por el LLM.
   */
 async analyzeData(
    query: string,
    data: Record<string, SeriesSummary>,
  ): Promise<string> {    
    
    const dataAsString = JSON.stringify(data, null, 2);

    // Un prompt bien diseñado es clave para obtener buenos resultados.
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
    const result = await this.llm.invoke(messages);

    return result.content.toString();
  }
}
