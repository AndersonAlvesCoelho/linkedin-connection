import getInput from './input.js'

export default async function menu() {
  const version = "1.0";

  console.log("----------------------------------------------------------");
  console.log("--------------------- Linkedin connection ----------------");
  console.log(
    `---------------------------- V ${version} ---------------------`
  );
  console.log("-- Selecionar opção:");
  console.log("1. Seção de curtidas");
  console.log("2. Seção de novas conexão");
  console.log("");

  const option = await getInput("Informe a opção desejada: ");
  const username = await getInput("Informe o login: ");
  const password = await getInput("Informe a senha: ");

  return { option, username, password };
}
