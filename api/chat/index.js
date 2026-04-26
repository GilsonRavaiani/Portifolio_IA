const { OpenAI } = require("openai");

module.exports = async function (context, req) {
  const pergunta = req.body?.pergunta || "Nenhuma pergunta recebida.";

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const resposta = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é o assistente oficial do portfólio do Gilson." },
        { role: "user", content: pergunta }
      ]
    });

    context.res = {
      status: 200,
      body: {
        resposta: resposta.choices[0].message.content
      }
    };
  } catch (erro) {
    context.res = {
      status: 500,
      body: { erro: erro.message }
    };
  }
};
