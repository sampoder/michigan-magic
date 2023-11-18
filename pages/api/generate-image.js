import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "YOUR_ORG_ID",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { snippet } = req.body;

  // 1. feed the snippet to gpt and generate a dalle-3 prompt
  // 2. feed the prompt to dalle-3 and generate an image
  // 3. return the image to the client

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `We are generating a role-play story where our main character is the CEO of a big AI company called OpenAI. We need to generate AI images for various scenarios in the story. The current scenario right now is: ${snippet}. Generate a DALL-E 3 prompt for this scenario.`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  const prompt = completion.choices[0].text;

  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt,
  });

  return res.status(200).json(image.data);
}
