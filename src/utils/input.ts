import readline from "readline";

export default async function getInput(
  question,
  lowerCase = false,
  defaultAnswer = null,
  isNumber = false,
  hidden = false
) {
  if (isNumber) {
    question = new Number(question);
  }

  if (lowerCase) {
    question = question.trim().toLowerCase();
  }

  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });

    if (defaultAnswer !== null) {
      rl.write(defaultAnswer);
    }

    if (hidden) {
      rl._writeToOutput = function () {
        rl.output.write("*");
      };
    }
  });
}
