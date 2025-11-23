import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from '../types';

// Função modificada para aceitar a apiKey como parâmetro
// Isso evita erros de "process is not defined" no navegador
export const analyzeExamPdf = async (base64Pdf: string, apiKey: string): Promise<AnalysisResponse> => {
  if (!apiKey) {
    throw new Error("Chave de API não fornecida.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const modelId = "gemini-2.5-flash"; // Efficient for text extraction and reasoning

  const prompt = `
    Você é um especialista em medicina laboratorial avançada e bioquímica.
    Analise o arquivo PDF fornecido, que contém resultados de exames laboratoriais.
    
    Sua tarefa é extrair os dados e explicar DETALHADAMENTE cada item, com uma linguagem clara, porém técnica e educativa.
    
    Para cada exame encontrado no documento:
    1. Identifique o nome do exame.
    2. Identifique o valor medido e a unidade.
    3. Identifique o valor de referência.
    4. Determine o status (NORMAL, ALTERADO, CRITICO).
    5. 'significadoClinico': O que esse exame mede no corpo humano? (Ex: "A glicose mede o açúcar no sangue...").
    6. 'explicacaoDetalhada': Por que o resultado deu esse valor? Se estiver alterado, quais as possíveis causas fisiológicas ou patológicas? Se estiver normal, o que isso indica de bom funcionamento?
    7. 'recomendacaoGeral': Sugestão de estilo de vida genérica (NÃO prescreva remédios).
    
    Também forneça um resumo geral da saúde do paciente baseado no conjunto de dados.
    
    IMPORTANTE: Se o nome do paciente não estiver claro, use "Paciente não identificado".
    IMPORTANTE: Retorne APENAS o JSON seguindo o schema fornecido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Pdf
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            paciente: { type: Type.STRING, description: "Nome do paciente se disponível" },
            dataExame: { type: Type.STRING, description: "Data do exame se disponível" },
            resumoGeral: { type: Type.STRING, description: "Um parágrafo resumindo a saúde geral baseada nos exames" },
            exames: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nomeExame: { type: Type.STRING },
                  valorMedido: { type: Type.STRING },
                  unidade: { type: Type.STRING },
                  valorReferencia: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ['NORMAL', 'ALTERADO', 'CRITICO', 'DESCONHECIDO'] },
                  significadoClinico: { type: Type.STRING, description: "O que é este exame" },
                  explicacaoDetalhada: { type: Type.STRING, description: "Interpretação profunda do resultado específico" },
                  recomendacaoGeral: { type: Type.STRING, description: "Dica de saúde relacionada" }
                },
                required: ["nomeExame", "valorMedido", "status", "significadoClinico", "explicacaoDetalhada"]
              }
            }
          },
          required: ["exames", "resumoGeral"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResponse;
    } else {
      throw new Error("Não foi possível gerar a análise. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    throw error;
  }
};