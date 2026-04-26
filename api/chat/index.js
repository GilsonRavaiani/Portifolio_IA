module.exports = async function (context, req) {
    const pergunta = req.body?.pergunta || "Nenhuma pergunta recebida";

    context.res = {
        status: 200,
        body: {
            resposta: `Você perguntou: ${pergunta}. A IA será integrada em breve.`
        }
    };
};
