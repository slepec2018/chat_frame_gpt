import { Configuration, OpenAIApi } from "openai";
import { withNextSession } from "@/lib/session";
import { dbConnect } from "@/lib/lowDb";
import bots from "./bots.json";

export default withNextSession (async (req, res) => {
  if (req.method === "POST") {
    const { stack } = req.query;
    const body = req.body;
    const prompt = body.prompt || "";
    const { user } = req.session;

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    });

    if (!configuration.apiKey) {
      return res.status(500).json({error: {message: "OpenAI Api Key is missing!"}});
    }

    if (!user) {
      return res.status(500).json({error: {message: "Session is missing!"}});
    }

    const USER_NAME = "Human";
    const AI_NAME = "Walt";

    const MEMORY_SIZE = 6;

    try {
      const db = await dbConnect();

      db.data.messageHistory[user.uid] ||= [];
      db.data.messageHistory[user.uid].push(`${USER_NAME}: ${prompt}\n`);

      const openai = new OpenAIApi(configuration);

      const aiPrompt = bots[stack].prompt;

      const completion = await openai.createCompletion({
        model: "gpt-3.5-turbo-instruct",
        prompt: aiPrompt + db.data.messageHistory[user.uid].join("") + "Walt:",
        temperature: 0.7,
        max_tokens: 1024
      });

      const aiResponse = (completion.data.choices[0].text).trim();

      db.data.messageHistory[user.uid].push(`${AI_NAME}: ${aiResponse}\n`);

      if (db.data.messageHistory[user.uid].length > MEMORY_SIZE) {
        db.data.messageHistory[user.uid].splice(0, 2);
      }

      return res.status(200).json({ result: aiResponse});
    } catch (error) {
      console.log(error);
      console.log(error.message);
      return res.status(500).json({error: {message: error.message}});
    }
  } else if (req.method === 'PUT') {
    const { uid } = req.query;

    if (!uid) {
      return res.status(500).json({ error: { message: "Invalid uid provided!" } });
    }

    req.session.user = {
      uid
    };

    await req.session.save();

    return res.status(200).json(uid);
  } else if (req.method === "DELETE") {
    const { user } = req.session;

    if (user) {
      const db = await dbConnect();

      db.data.messageHistory[user.uid] = [];

      return res.status(200).json({ message: "History cleared!" });
    }

    return res.status(200).json({ message: "Nothing to clear!" });
  } else {
    return res.status(500).json({ error: { message: "Invalid Api Route"} });
  }
})