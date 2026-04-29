const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

function carregarBaseDeConhecimento() {
  const contextoPath = path.join(__dirname, "..", "data", "contexto.json");
  const conteudo = fs.readFileSync(contextoPath, "utf8");
  return JSON.parse(conteudo);
}

function selecionarContexto(base, pergunta) {
  const p = pergunta.toLowerCase();

  if (
    p.includes("certificação") ||
    p.includes("certificações") ||
    p.includes("certificado") ||
    p.includes("certificados")
  ) {
    return {
      tipo: "certificacoes",
      contexto: base.certificacoes.join("\n")
    };
  }

  if (
    p.includes("experiência") ||
    p.includes("experiencias") ||
    p.includes("empresa") ||
    p.includes("empresas") ||
    p.includes("trabalho") ||
    p.includes("trabalhou") ||
    p.includes("carreira")
  ) {
    return {
      tipo: "experiencia",
      contexto: base.experiencia.join("\n")
    };
  }

  if (
    p.includes("tecnologia") ||
    p.includes("tecnologias") ||
    p.includes("skill") ||
    p.includes("skills") ||
    p.includes("conhecimento") ||
    p.includes("conhecimentos") ||
    p.includes("ferramenta") ||
    p.includes("ferramentas")
  ) {
    return {
      tipo: "skills",
      contexto: base.skills.join("\n")
    };
  }

  if (
    p.includes("formação") ||
    p.includes("formacao") ||
    p.includes("curso") ||
    p.includes("cursos") ||
    p.includes("graduação") ||
    p.includes("graduacao") ||
    p.includes("pós") ||
    p.includes("pos")
  ) {
    return {
      tipo: "formacao",
      contexto: base.formacao.join("\n")
    };
  }

  if (
    p.includes("objetivo") ||
    p.includes("meta") ||
    p.includes("metas") ||
    p.includes("futuro") ||
    p.includes("pretende")
  ) {
    return {
      tipo: "objetivo",
      contexto: base.objetivo.join("\n")
    };
  }

  return {
    tipo: "resumo",
    contexto: [
      `Resumo: ${base.resumo}`,
      "",
      "Experiência:",
      ...base.experiencia,
      "",
      "Certificações:",
      ...base.certificacoes,
      "",
      "Skills:",
      ...base.skills,
      "",
      "Formação:",
      ...base.formacao,
      "",
      "Objetivos:",
      ...base.objetivo
    ].join("\n")
  };
}

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

    const base = carregarBaseDeConhecimento();
    const resultadoContexto = selecionarContexto(base, message);

    const systemPrompt = `
Você é um assistente especializado no portfólio de Gilson Ravaiani.

REGRAS CRÍTICAS:
- Responda SOMENTE com base nas informações do contexto abaixo.
- NÃO invente certificações, experiências, empresas, tecnologias, cursos ou projetos.
- NÃO use conhecimento externo.
- Se a informação não estiver no contexto, responda exatamente:
  "Não encontrei essa informação no meu contexto atual."
- Seja claro, profissional e objetivo.
- Quando fizer sentido, organize a resposta em lista.

TIPO DE CONTEXTO SELECIONADO:
${resultadoContexto.tipo}

CONTEXTO:
${resultadoContexto.contexto}
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

    const reply =
      response.output_text || "Nao foi possivel gerar uma resposta no momento.";

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        reply,
        contextoSelecionado: resultadoContexto.tipo
      }
    };
 } catch (error) {
  context.log.error("ERRO COMPLETO:", error);

  context.res = {
    status: 500,
    headers: { "Content-Type": "application/json" },
    body: {
      error: "Erro ao processar a requisicao.",
      detalhe: error.message
    }
  };
}