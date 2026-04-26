const { OpenAI } = require("openai");

module.exports = async function (context, req) {
  const pergunta = req.body?.pergunta || "Nenhuma pergunta recebida.";
  context.log(`Pergunta recebida: ${pergunta}`);

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    context.log("Fazendo chamada para a OpenAI...");
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
    context.log('Erro ao chamar OpenAI:', erro.message);
    context.res = {
      status: 500,
      body: { erro: erro.message }
    };
  }
};