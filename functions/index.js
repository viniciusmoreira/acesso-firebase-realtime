const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Inicializa a aplicação
admin.initializeApp();

// Definindo qual tabela será a origem do gatilho.
exports.soma = functions.database.ref('/movimentacoes/{dia}')
  // Disparando quando algo for gravado na tabela de origem.
  .onWrite(async(change, context) => {
    // Pega referência do destino, onde vamos inserir os dados.
    const mesesRef = admin.database().ref('/meses/'+context.params.dia);

    // Pega a referência do registro que foi gravado na tabela de origem.
    const movimentacoesRef = change.after.ref;

    // Busca snapshot da referência 
    const movimentacoesSS = await movimentacoesRef.once('value');

    // Pega os valores reais do snapshot 
    const movimentacoes = movimentacoesSS.val();

    let entradas = 0;
    let saidas = 0;

    Object.keys(movimentacoes).forEach(m => {
      if(movimentacoes[m].valor > 0){
        entradas += movimentacoes[m].valor
      } else {
        saidas += movimentacoes[m].valor
      }
    })

    // Retorna os dados para gravação dos meses
    return mesesRef.transaction(current => {
      if(current === null){
        return {
          entradas,
          saidas,
          previsao_entrada: 0,
          previsao_saida: 0
        }
      }

      return {
        ...current,
        entradas,
        saidas
      }
    })
  })