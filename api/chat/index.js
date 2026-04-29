const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

module.exports = async function (context, req) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      context.res = {
        status: 500,
        headers: { "Content-Type": "application/json" },
        body: { error: "OPENAI_API_KEY nao configurada." }
      };
      return;
    }

    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      context.res = {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: { error: "Campo 'message' obrigatorio." }
      };
      return;
    }

    const contextoPath = path.join(__dirname, "..", "data", "contexto.txt");
    const contexto = fs.readFileSync(contextoPath, "utf8");

    const systemPrompt = `
Você é o assistente virtual do portfólio de Gilson Ravaiani.

Regras:
- Responda com clareza, objetividade e tom profissional.
- Use apenas as informações presentes no contexto fornecido.
- Não invente experiências, tecnologias, certificados ou projetos.
- Se a resposta não estiver no contexto, diga claramente que não possui essa informação.
- Quando fizer sentido, destaque experiências com cloud, suporte, infraestrutura, Azure, AWS, telecom e evolução profissional.

Contexto:
${contexto}
`;

    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.output_text || "Nao foi possivel gerar uma resposta no momento.";

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { reply }
    };
  } catch (error) {
    context.log.error("Erro em /api/chat:", error);

    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: {
        error: "Erro ao processar a requisicao.",
        details: error.message
      }
    };
  }
};