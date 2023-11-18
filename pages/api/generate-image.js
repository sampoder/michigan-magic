import { OpenAI } from "openai";

const openai = new OpenAI();

export default async function handler(req, res) {
  const { snippet } = req.body;

  if (!snippet) {
    return res.status(400).json({ error: "Snippet is required" });
  }

  // const completion = await openai.chat.completions.create({
  //   messages: [
  //     {
  //       role: "user",
  //       content: `We are generating a role-play story where our main character is the CEO of a big AI company called OpenAI. There can be various scenarios that happen at different points of the story.
  //        We need to generate AI images for these scenarios in the story, and those images should nicely describe the environment.
  //        The current scenario right now is: ${snippet}.
  //       Generate a detailed DALL-E 3 prompt for this scenario that can help us add a relevant image to the story.
  //       Do not include any additonal text. Your response should strictly be a DALL-E 3 prompt.`,
  //     },
  //   ],
  //   model: "gpt-3.5-turbo",
  // });

  // console.log(completion.choices[0].message);

  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: `We are generating a role-play story where our main character is the CEO of a big AI company called OpenAI. There can be various scenarios that happen at different points of the story.
      We need to generate AI images for these scenarios in the story, and those images should nicely describe the environment. 
      The current scenario right now is: ${snippet}.`,
  });

  console.log(image);

  return res.status(200).json(image.data);
}
