'use server';

/**
 * @fileOverview This file defines a Genkit flow for dynamically updating product recommendations based on user interactions.
 *
 * The flow takes user data and interaction history as input and returns personalized product recommendations.
 * - updateRecommendations - The function that triggers the update and retrieval of product recommendations.
 * - UpdateRecommendationsInput - The input type for the updateRecommendations function.
 * - UpdateRecommendationsOutput - The return type for the updateRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  interests: z.array(z.string()).describe('The user\u2019s selected interests (tech, fashion, sports, etc.)'),
  browsingHistory: z.array(z.string()).describe('An array of product IDs representing the user\u2019s browsing history.'),
  searchHistory: z.array(z.string()).describe('An array of search queries performed by the user.'),
  purchaseHistory: z.array(z.string()).describe('An array of product IDs representing the user\u2019s purchase history.'),
});
export type UpdateRecommendationsInput = z.infer<typeof UpdateRecommendationsInputSchema>;

const UpdateRecommendationsOutputSchema = z.object({
  productRecommendations: z.array(z.string()).describe('An array of product IDs recommended for the user.'),
});
export type UpdateRecommendationsOutput = z.infer<typeof UpdateRecommendationsOutputSchema>;

export async function updateRecommendations(input: UpdateRecommendationsInput): Promise<UpdateRecommendationsOutput> {
  return updateRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'updateRecommendationsPrompt',
  input: {schema: UpdateRecommendationsInputSchema},
  output: {schema: UpdateRecommendationsOutputSchema},
  prompt: `You are an AI assistant named Nova that provides personalized product recommendations for an e-commerce platform.

  Based on the user's interests, browsing history, search history, and purchase history, recommend products that are most relevant to their current shopping needs.

  Interests: {{interests}}
  Browsing History: {{browsingHistory}}
  Search History: {{searchHistory}}
  Purchase History: {{purchaseHistory}}

  Provide an array of product IDs representing the recommended products.  Only list product IDs.
  Products should be in the following format: ["product_id_1", "product_id_2", "product_id_3"]
  `,
});

const updateRecommendationsFlow = ai.defineFlow(
  {
    name: 'updateRecommendationsFlow',
    inputSchema: UpdateRecommendationsInputSchema,
    outputSchema: UpdateRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
