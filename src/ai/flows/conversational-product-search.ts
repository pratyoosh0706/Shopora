
'use server';
/**
 * @fileOverview This file defines a Genkit flow for conversational product search.
 *
 * The flow allows users to ask questions about products using natural language, and the AI
 * will respond with relevant product recommendations.
 *
 * @module src/ai/flows/conversational-product-search
 *
 * @public
 *
 * @param {string} query - The user's search query.
 * @returns {Promise<string>} - A promise that resolves with the AI's response, recommending relevant products.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConversationalProductSearchInputSchema = z.object({
  query: z.string().describe("The user's search query."),
  products: z
    .string()
    .describe('A JSON string of all available products.'),
});
export type ConversationalProductSearchInput = z.infer<typeof ConversationalProductSearchInputSchema>;

const ConversationalProductSearchOutputSchema = z.object({
    response: z.string().describe("The AI's response with product recommendations."),
});
export type ConversationalProductSearchOutput = z.infer<typeof ConversationalProductSearchOutputSchema>;

export async function conversationalProductSearch(input: ConversationalProductSearchInput): Promise<ConversationalProductSearchOutput> {
  return conversationalProductSearchFlow(input);
}

const conversationalProductSearchPrompt = ai.definePrompt({
  name: 'conversationalProductSearchPrompt',
  input: {schema: ConversationalProductSearchInputSchema},
  output: {schema: ConversationalProductSearchOutputSchema},
  prompt: `You are Nova, a helpful AI assistant specializing in product recommendations for an e-commerce website.
  A user is asking you a question about products, and you should respond with relevant product recommendations based on the provided product list.
  Be conversational and helpful.

  User query: {{{query}}}
  
  Available Products (JSON):
  {{{products}}}
  `,
});

const conversationalProductSearchFlow = ai.defineFlow(
  {
    name: 'conversationalProductSearchFlow',
    inputSchema: ConversationalProductSearchInputSchema,
    outputSchema: ConversationalProductSearchOutputSchema,
  },
  async (input) => {
    const {output} = await conversationalProductSearchPrompt(input);
    return output!;
  }
);
