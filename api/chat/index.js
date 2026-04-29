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
Você é um assistente especializado no portfólio de Gilson Ravaiani.

REGRAS CRÍTICAS:
- Responda SOMENTE com base nas informações do contexto abaixo.
- NÃO invente certificações, experiências, empresas ou tecnologias.
- NÃO use conhecimento externo.
- Se a informação não estiver no contexto, responda exatamente:
  "Não encontrei essa informação no meu contexto atual."
- Seja direto e objetivo.

FORMATO:
- Respostas claras
- Use listas quando fizer sentido

CONTEXTO:
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