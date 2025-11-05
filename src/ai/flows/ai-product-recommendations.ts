'use server';

/**
 * @fileOverview AI-powered product recommendations flow.
 *
 * This file defines a Genkit flow that provides personalized product recommendations
 * based on user interests and browsing history.
 *
 * @remarks
 * The flow takes user ID, interests, and browsing history as input and returns a list of recommended products.
 *
 * @example
 * // Example usage:
 * const recommendations = await getAIProductRecommendations({
 *   userId: 'user123',
 *   interests: ['tech', 'gadgets'],
 *   browsingHistory: ['productA', 'productB'],
 * });
 *
 * @exports getAIProductRecommendations - The main function to trigger the product recommendation flow.
 * @exports AIProductRecommendationsInput - The input type for the getAIProductRecommendations function.
 * @exports AIProductRecommendationsOutput - The output type for the getAIProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const AIProductRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  interests: z.array(z.string()).describe('The interests of the user.'),
  browsingHistory: z.array(z.string()).describe('The browsing history of the user (product IDs).'),
});

export type AIProductRecommendationsInput = z.infer<typeof AIProductRecommendationsInputSchema>;

const AIProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of recommended product IDs.'),
});

export type AIProductRecommendationsOutput = z.infer<typeof AIProductRecommendationsOutputSchema>;

export async function getAIProductRecommendations(input: AIProductRecommendationsInput): Promise<AIProductRecommendationsOutput> {
  return aiProductRecommendationsFlow(input);
}

const aiProductRecommendationsPrompt = ai.definePrompt({
  name: 'aiProductRecommendationsPrompt',
  input: {schema: AIProductRecommendationsInputSchema},
  output: {schema: AIProductRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized product recommendations for e-commerce users.

  Based on the user's interests and browsing history, suggest a list of product IDs that the user might be interested in.

  User Interests: {{interests}}
  Browsing History: {{browsingHistory}}

  Provide only product IDs in the output.  Do not include product names, descriptions, or other information.
  The output should be a JSON array of product IDs.
  `,
});

const aiProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiProductRecommendationsFlow',
    inputSchema: AIProductRecommendationsInputSchema,
    outputSchema: AIProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await aiProductRecommendationsPrompt(input);
    return output!;
  }
);
