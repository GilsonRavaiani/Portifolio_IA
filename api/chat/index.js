const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

function lerJsonSeguro(caminho) {
  if (!fs.existsSync(caminho)) {
    throw new Error(`Arquivo nao encontrado: ${caminho}`);
  }

  const conteudo = fs.readFileSync(caminho, "utf8");

  if (!conteudo || !conteudo.trim()) {
    throw new Error("Arquivo de contexto vazio.");
  }

  try {
    return JSON.parse(conteudo);
  } catch (error) {
    throw new Error(`JSON invalido em contexto.json: ${error.message}`);
  }
}

function toArray(valor) {
  return Array.isArray(valor) ? valor : [];
}

function selecionarContexto(base, pergunta) {
  const p = String(pergunta || "").toLowerCase();

  const certificacoes = toArray(base.certificacoes);
  const experiencia = toArray(base.experiencia);
  const skills = toArray(base.skills);
  const formacao = toArray(base.formacao);
  const objetivo = toArray(base.objetivo);
  const resumo = base.resumo || "";

  if (
    p.includes("certificação") ||
    p.includes("certificações") ||
    p.includes("certificacao") ||
    p.includes("certificacoes") ||
    p.includes("certificado") ||
    p.includes("certificados")
  ) {
    return {
      tipo: "certificacoes",
      contexto: certificacoes.join("\n")
    };
  }

  if (
    p.includes("experiência") ||
    p.includes("experiencia") ||
    p.includes("trabalho") ||
    p.includes("trabalhou") ||
    p.includes("empresa") ||
    p.includes("empresas") ||
    p.includes("carreira")
  ) {
    return {
      tipo: "experiencia",
      contexto: experiencia.join("\n")
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
      contexto: skills.join("\n")
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
      contexto: formacao.join("\n")
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
      contexto: objetivo.join("\n")
    };
  }

  return {
    tipo: "resumo",
    contexto: [
      `Resumo: ${resumo}`,
      "",
      "Experiência:",
      ...experiencia,
      "",
      "Certificações:",
      ...certificacoes,
      "",
      "Skills:",
      ...skills,
      "",
      "Formação:",
      ...formacao,
      "",
      "Objetivos:",
      ...objetivo
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
        body: {
          error: "OPENAI_API_KEY nao configurada."
        }
      };
      return;
    }

    const body = req && req.body ? req.body : {};
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      context.res = {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: {
          error: "Campo 'message' obrigatorio."
        }
      };
      return;
    }

    const contextoPath = path.join(__dirname, "..", "data", "contexto.json");
    const base = lerJsonSeguro(contextoPath);
    const selecionado = selecionarContexto(base, message);

    if (!selecionado.contexto || !selecionado.contexto.trim()) {
      context.res = {
        status: 500,
        headers: { "Content-Type": "application/json" },
        body: {
          error: "Contexto selecionado vazio."
        }
      };
      return;
    }

    const client = new OpenAI({ apiKey });

    const systemPrompt = `
Você é um assistente especializado no portfólio de Gilson Ravaiani.

REGRAS:
- Responda somente com base no contexto fornecido.
- Nao invente informacoes.
- Nao use conhecimento externo.
- Se algo nao estiver no contexto, responda exatamente:
  "Nao encontrei essa informacao no meu contexto atual."
- Seja objetivo, claro e profissional.
- Quando fizer sentido, use listas.

TIPO DE CONTEXTO:
${selecionado.tipo}

CONTEXTO:
${selecionado.contexto}
`;

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

    const reply = response.output_text || "Nao foi possivel gerar resposta.";

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        reply,
        contextoSelecionado: selecionado.tipo
      }
    };
  } catch (error) {
    context.log.error("ERRO /api/chat:", error);

    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: {
        error: "Erro ao processar a requisicao.",
        detalhe: error && error.message ? error.message : "Erro desconhecido."
      }
    };
  }
};