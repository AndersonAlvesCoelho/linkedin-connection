import readline from "readline";

export default async function getInput(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false, // Desativa o modo de terminal para que a entrada não seja exibida
    });

    rl.question(question + " ", (answer) => {
      // Exibe a pergunta e obtém a resposta
      rl.close();
      resolve(answer);
    });
  });
}
