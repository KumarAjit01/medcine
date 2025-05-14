'use server';

/**
 * @fileOverview Medicine recommendation based on symptoms.
 *
 * - recommendMedicines - A function that recommends medicines based on symptoms.
 * - RecommendMedicinesInput - The input type for the recommendMedicines function.
 * - RecommendMedicinesOutput - The return type for the recommendMedicines function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendMedicinesInputSchema = z.object({
  symptoms: z.string().describe('The symptoms experienced by the user.'),
});
export type RecommendMedicinesInput = z.infer<typeof RecommendMedicinesInputSchema>;

const RecommendMedicinesOutputSchema = z.object({
  medicines: z
    .array(z.string())
    .describe('An array of recommended medicines based on the symptoms.'),
  warning: z
    .string()
    .optional()
    .describe(
      'A warning message to consult a doctor if the symptoms are severe or persist.'
    ),
});
export type RecommendMedicinesOutput = z.infer<typeof RecommendMedicinesOutputSchema>;

export async function recommendMedicines(
  input: RecommendMedicinesInput
): Promise<RecommendMedicinesOutput> {
  return recommendMedicinesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendMedicinesPrompt',
  input: {schema: RecommendMedicinesInputSchema},
  output: {schema: RecommendMedicinesOutputSchema},
  prompt: `You are a helpful AI assistant specializing in medicine recommendations.

  Based on the symptoms provided by the user, recommend a list of medicines that can help alleviate the symptoms.
  If the symptoms described seem severe or potentially dangerous, include a warning to consult a doctor immediately.

  Symptoms: {{{symptoms}}}
  `,
});

const recommendMedicinesFlow = ai.defineFlow(
  {
    name: 'recommendMedicinesFlow',
    inputSchema: RecommendMedicinesInputSchema,
    outputSchema: RecommendMedicinesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
