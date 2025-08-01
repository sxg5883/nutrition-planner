import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  const { calories, protein, restrictions, cuisine } = await req.json();

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
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const mealPlan = completion.choices?.[0]?.message?.content || '';
    return NextResponse.json({ mealPlan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
