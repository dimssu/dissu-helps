import type { LlmProvider } from './llmConfigs';

export interface AiConfig {
  llmProvider: LlmProvider;
  apiKey: string;
}

let aiConfig: AiConfig | null = null;

export function setAiConfig(config: AiConfig) {
  aiConfig = config;
}

export function getAiConfig(): AiConfig {
  if (!aiConfig) {
    throw new Error(
      'AI components are not configured. Please call setAiConfig at the root of your application.'
    );
  }
  return aiConfig;
} 