import { input, password } from '@inquirer/prompts';

console.log('Informe suas credenciais de login do Linkedin.');
const username = await input({ message: 'E-mail ou Telefone:' });
const passwordLinkedin = await password({ message: 'Senha' , mask: true});

console.log('username:', username);
console.log('password:', passwordLinkedin);
