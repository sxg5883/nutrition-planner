// Import Next.js request/response types for App Router API routes
import { NextRequest, NextResponse } from 'next/server';
// Import the official OpenAI SDK (v4+)
import OpenAI from 'openai';

// Instantiate a single OpenAI client using your API key from env.
// NOTE: never hardcode secrets; rely on environment variables.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // If empty, calls will fail—consider guarding below.
});

/**
 * POST /api/meal
 * Expects a JSON body with nutrition preferences and returns a model-generated meal plan.
 * Body shape:
 * {
 *   calories: number,
 *   protein: number,
 *   restrictions: string | string[],
 *   cuisine: string
 * }
 */
export async function POST(req: NextRequest) {
  // Parse JSON payload from the request body
  const { calories, protein, restrictions, cuisine } = await req.json();

  // Construct a clear prompt that the model can follow.
  // Use template literals to inject user inputs. Keep instructions specific and structured.
  const prompt = `
Create a full-day meal plan with:
- ${calories} calories
- ${protein}g protein
- Restrictions: ${restrictions}
- Cuisine: ${cuisine}
Include: breakfast, lunch, dinner, snacks. List ingredients, servings, calories, protein, fat, sugar.
Format it clearly.
`;

  try {
    // Optional safety check: ensure API key is present before calling the model
    // if (!process.env.OPENAI_API_KEY) {
    //   return NextResponse.json({ error: 'Server misconfigured: missing OPENAI_API_KEY' }, { status: 500 });
    // }

    // Create a chat completion with the chosen model.
    // Tip: lower temperature for more consistent structure; add max_tokens to cap response length.
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Consider 'gpt-4o-mini' or another available model for cost/latency tradeoffs.
      messages: [{ role: 'user', content: prompt }],
      // temperature: 0.4,
      // max_tokens: 800,
    });

    // Extract the assistant's text response safely with optional chaining fallback
    const mealPlan = completion.choices?.[0]?.message?.content || '';

    // Return JSON to the client; NextResponse handles headers/serialization.
    return NextResponse.json({ mealPlan });
  } catch (error: any) {
    // On error (network, auth, quota, etc.), return a 500 with message for debugging.
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
