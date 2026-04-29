const OpenAI = require("openai");

module.exports = async function (context, req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      context.res = {
        status: 500,
        body: { error: "OPENAI_API_KEY não configurada." }
      };
      return;
    }

    const { message } = req.body || {};

    if (!message) {
      context.res = {
        status: 400,
        body: { error: "Mensagem não enviada." }
      };
      return;
    }

    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Responda como assistente do portfólio de Gilson Ravaiani: ${message}`
    });

    context.res = {
      status: 200,
      body: {
        reply: response.output_text
      }
    };

  } catch (error) {
    context.log.error(error);

    context.res = {
      status: 500,
      body: {
        error: "Erro ao chamar OpenAI",
        details: error.message
      }
    };
  }
};