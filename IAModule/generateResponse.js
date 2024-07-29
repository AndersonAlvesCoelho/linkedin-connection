import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '--',
});

export async function generateResponse(question) {
  const prompt = `Levando em consideração que eu sou um Desenvolvedor Fullstack com 5 anos de experiência no mercado, tenho senioridade de sênior, sou de Brasília, tenho muita experiência com JavaScript, TypeScript, Java e NestJS, responda: "${question}"`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Você é um assistente útil.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 100,
  });
  console.log(response.choices[0].message.content.trim());

  return response.choices[0].message.content.trim();
}
