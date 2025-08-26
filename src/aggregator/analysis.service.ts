import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import * as dotenv from 'dotenv';

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
  async analyzeData(query: string, data: any[]): Promise<string> {
    const dataAsString = JSON.stringify(data, null, 2);

    // Un prompt bien diseñado es clave para obtener buenos resultados.
    const prompt = `
      You are an expert financial analyst. Your task is to analyze the provided economic data and answer the user's question based on it.

      User's Question: "${query}"

      Data:
      \`\`\`json
      ${dataAsString}
      \`\`\`

      Provide a concise and clear analysis based only on the data provided.
    `;

    const messages = [new HumanMessage(prompt)];
    const result = await this.llm.invoke(messages);

    return result.content.toString();
  }
}
