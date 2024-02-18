import { Configuration, OpenAIApi } from "openai";

export default async function completion(req, res) {
  if (req.method === "POST") {
    const body = req.body;
    const prompt = body.prompt || "";

    const AI_PROMPT = "The following is a conversation with Walt. Walt is helpful and creative. Walt`s only knowledge is React JS library. He can only answer questions related to React JS. He only cares about React JS. Walt provides often code examples. Walt provides answers formated in markdown format.";
    const AI_RESPONSE = "``` import React from 'react'; const Button = () => { return <button>Click Me!</button>; } export default Button; ```";

    return res.status(200).json({ result: AI_RESPONSE});

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    });

    try {
      const openai = new OpenAIApi(configuration);

      const formatedPrompt = AI_PROMPT + "\n" + prompt + "\n" + "Walt:";

      const completion = await openai.createCompletion({
        model: "gpt-3.5-turbo-instruct",
        prompt: formatedPrompt,
        temperature: 0.7,
        max_tokens: 1024
      });

      const aiResponse = (completion.data.choices[0].text).trim();
      return res.status(200).json({ result: aiResponse});
    } catch (error) {
      console.log(error);
      console.log(error.message);
      return res.status(500).json({error: {message: error.message}});
    }
  } else {
    return res.status(500).json({ error: { message: "Invalid Api Route"} });
  }
}