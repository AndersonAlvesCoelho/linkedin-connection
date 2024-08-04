import readline from 'readline';

interface ExtendedReadline extends readline.Interface {
	_writeToOutput: (stringToWrite: string) => void;
	output: NodeJS.WriteStream;
}

export async function getInputText(
	question: string,
	lowerCase = false,
	defaultAnswer: string | null = null,
	hidden = false,
): Promise<string> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: true,
	}) as ExtendedReadline;

	const askQuestion = (query: string): Promise<string> => {
		return new Promise(resolve => {
			rl.question(query, (answer: string) => {
				resolve(answer);
			});
		});
	};

	if (hidden) {
		rl.output.write('\x1B[?25l');
		rl._writeToOutput = (stringToWrite: string) => {
			rl.output.write('*');
		};
	}

	try {
		let answer = await askQuestion(`${question} `);

		if (hidden) {
			rl.output.write('\x1B[?25h\n');
			rl._writeToOutput = (stringToWrite: string) => {
				rl.output.write(stringToWrite);
			};
		}

		if (!answer && defaultAnswer !== null) {
			answer = defaultAnswer;
		}

		if (lowerCase) {
			answer = answer.toLowerCase();
		}

		return answer;
	} finally {
		rl.close();
	}
}

export async function getInputNumber(
	question: string,
	defaultAnswer: number | null = null,
	hidden = false,
): Promise<number> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: true,
	}) as ExtendedReadline;

	const askQuestion = (query: string): Promise<string> => {
		return new Promise(resolve => {
			rl.question(query, (answer: string) => {
				resolve(answer);
			});
		});
	};

	if (hidden) {
		rl.output.write('\x1B[?25l');
		rl._writeToOutput = (stringToWrite: string) => {
			rl.output.write('*');
		};
	}

	try {
		while (true) {
			let answer = await askQuestion(`${question} `);

			if (hidden) {
				rl.output.write('\x1B[?25h\n');
				rl._writeToOutput = (stringToWrite: string) => {
					rl.output.write(stringToWrite);
				};
			}

			if (!answer && defaultAnswer !== null) {
				return defaultAnswer;
			}

			const parsedNumber = parseFloat(answer);
			if (!isNaN(parsedNumber)) {
				return parsedNumber;
			} else {
				console.log('Por favor, insira um número válido.');
			}
		}
	} finally {
		rl.close();
	}
}
