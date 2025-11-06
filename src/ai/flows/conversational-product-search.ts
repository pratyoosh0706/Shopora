
'use server';
/**
 * @fileOverview This file defines a Genkit flow for conversational product search.
 *
 * The flow allows users to ask questions about products using natural language, and the AI
 * will respond with relevant product recommendations. It uses a tool to search the product
 * database, making it more efficient than passing the entire product list.
 *
 * @module src/ai/flows/conversational-product-search
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getProducts } from '@/app/actions';
import type { Product } from '@/lib/types';

// Input for the main flow is just the user's query
const ConversationalProductSearchInputSchema = z.object({
  query: z.string().describe("The user's search query."),
});
export type ConversationalProductSearchInput = z.infer<
  typeof ConversationalProductSearchInputSchema
>;

// Output remains the same
const ConversationalProductSearchOutputSchema = z.object({
  response: z.string().describe("The AI's response with product recommendations."),
});
export type ConversationalProductSearchOutput = z.infer<
  typeof ConversationalProductSearchOutputSchema
>;

/**
 * A tool that the AI can use to search for products in the database.
 * The AI will decide when to call this tool based on the user's query.
 */
const searchProductsTool = ai.defineTool(
  {
    name: 'searchProducts',
    description: 'Search for products based on a query or category.',
    inputSchema: z.object({
      query: z.string().describe('A search query to filter products by name, description, or category. Can be a single word or a sentence.'),
    }),
    outputSchema: z.array(z.custom<Product>()),
  },
  async ({ query }) => {
    console.log(`Using tool to search for products with query: ${query}`);
    const allProducts = await getProducts();
    // Simple text search across name, category, and description
    const filteredProducts = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); // Limit to 10 results to keep the response concise
    return filteredProducts;
  }
);


export async function conversationalProductSearch(
  input: ConversationalProductSearchInput
): Promise<ConversationalProductSearchOutput> {
  return conversationalProductSearchFlow(input);
}

const conversationalProductSearchPrompt = ai.definePrompt({
  name: 'conversationalProductSearchPrompt',
  // The prompt now uses the search tool
  tools: [searchProductsTool],
  prompt: `You are Nova, a helpful AI assistant specializing in product recommendations for an e-commerce website.
A user is asking you a question about products.
Use the 'searchProducts' tool to find relevant products based on the user's query.
Answer the user's question based on the tool's output.
All prices are in Indian Rupees (₹). When you mention a price, make sure to use the ₹ symbol.
Be conversational and helpful. If no products are found, say so in a friendly way.

User query: {{{query}}}
`,
});

const conversationalProductSearchFlow = ai.defineFlow(
  {
    name: 'conversationalProductSearchFlow',
    inputSchema: ConversationalProductSearchInputSchema,
    outputSchema: ConversationalProductSearchOutputSchema,
  },
  async (input) => {
    const llmResponse = await conversationalProductSearchPrompt(input);

    // If the model calls the tool, it will be in the response.
    // The Genkit/Firebase runner handles executing the tool and feeding the result back to the model.
    // The final response from the model will be a text response.
    
    return {
        response: llmResponse.output || "Sorry, I couldn't find an answer to that."
    };
  }
);
