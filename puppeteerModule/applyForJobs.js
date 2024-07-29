import { generateResponse } from '../IAModule/generateResponse.js';
import { saveResponsesToFile, loadResponsesFromFile } from '../utils/fileUtils.js';
import { browserConstants } from "../config/constants.js";
import { delay } from "../helper/delay.js";
import { login, startBrowser } from "./start.js";

const { jobSearchUrl, applyButton, questionnaireSelectors, nextPage, modalButtons } = browserConstants.jobs;

async function applyForJobs(username, password, searchTerm, responses) {
  const { browser, page } = await startBrowser();

  try {
    await login(page, username, password);
    await delay(5000);

    const searchUrl = jobSearchUrl.replace("{{term}}", encodeURIComponent(searchTerm));
    await page.goto(searchUrl);
    await delay(5000);

    while (true) {
      try {
        await page.waitForSelector(applyButton, { timeout: 30000 });
      } catch (err) {
        console.log("Botão de candidatura simplificada não encontrado. Tentando na próxima página...");
        try {
          await page.waitForSelector(nextPage);
          await page.click(nextPage);
          await delay(5000);
          continue;
        } catch (nextPageErr) {
          console.log("Não foi possível encontrar o botão de próxima página ou houve um erro ao clicar.");
          break;
        }
      }

      const jobButtons = await page.$$(applyButton);

      for (let i = 0; i < jobButtons.length; i++) {
        await jobButtons[i].click();
        await delay(2000);

        await applyToJob(page, responses);
        await delay(2000);
      }

      try {
        await page.waitForSelector(nextPage);
        await page.click(nextPage);
        await delay(5000);
      } catch (err) {
        console.log("Não foi possível encontrar o botão de próxima página ou houve um erro ao clicar.");
        break;
      }
    }
  } catch (err) {
    console.error("Err: ", err);
  } finally {
    browser.close();
  }
}

async function applyToJob(page, responses) {
  try {
    console.log(page);
    await handleQuestionnaire(page, responses);

    while (await handleModal(page)) {
      await delay(2000);
    }

    const submitApplicationSelector = 'button[aria-label="Enviar sua candidatura"]';
    try {
      await page.waitForSelector(submitApplicationSelector, { timeout: 30000 });
      await page.click(submitApplicationSelector);
    } catch (err) {
      console.log("Erro ao tentar clicar no botão de envio final: ", err);
    }
  } catch (err) {
    console.log("Erro ao tentar se candidatar: ", err);
  }
}

async function handleModal(page) {
  for (const selector of modalButtons) {
    try {
      const button = await page.$(selector);
      if (button) {
        await button.click();
        await delay(2000);
        return true; // Se encontrar um botão e clicar, retorne true
      }
    } catch (err) {
      console.log(`Erro ao clicar no botão do modal (${selector}): `, err);
    }
  }
  return false; // Se não encontrar nenhum botão para clicar, retorne false
}

async function handleQuestionnaire(page, responses) {
    const questionsAndAnswers = {};
    const jobTitle = await page.evaluate(() => {
      const element = document.querySelector('h2#jobs-apply-header');
      return element ? element.innerText : 'unknown-job';
    });
    const savedResponses = loadResponsesFromFile(jobTitle) || responses;
  
    try {
      for (const selector of questionnaireSelectors) {
        const elements = await page.$$(selector);
        
        console.log(`Encontrados ${elements.length} elementos para o seletor: ${selector}`);
  
        for (let i = 0; i < elements.length; i++) {
          if (!elements[i]) continue; // Skip if element is undefined
          console.log(`Processando elemento ${i + 1} de ${elements.length}`);
          
          const question = await page.evaluate(el => {
            const formElement = el.closest('div[data-test-form-element]');
            if (formElement) {
              const labelElement = formElement.querySelector('label');
              return labelElement ? labelElement.innerText : null;
            }
            return null;
          }, elements[i]);
  
          console.log(`Pergunta encontrada: ${question}`);
  
          if (!question || /Código do país|E-mail|numero|Número de celular|phone|email|telef/i.test(question)) {
            console.log(`Ignorando pergunta: ${question}`);
            continue; // Skip if question contains "numero", "phone", "email" or "telefone"
          }
  
          let response;
  
          if (savedResponses[question]) {
            response = savedResponses[question];
          } else {
            response = await generateResponse(question);
            questionsAndAnswers[question] = response;
          }
  
          const tagName = await elements[i].evaluate(el => el.tagName.toLowerCase());
          console.log(`Tag do elemento: ${tagName}`);
  
          if (tagName === 'input' || tagName === 'textarea') {
            console.log(`Preenchendo resposta: ${response}`);
            await elements[i].type(response);
          } else if (tagName === 'select') {
            const options = await elements[i].$$('option');
            const valueToSelect = await page.evaluate(option => option.value, options[1]);
            console.log(`Selecionando valor: ${valueToSelect}`);
            await elements[i].select(valueToSelect); // Select the first option
          } else if (tagName === 'input' && (await elements[i].evaluate(el => el.type.toLowerCase())) === 'radio') {
            const radioButtons = await elements[i].$$('input[type="radio"]');
            console.log(`Clicando no último botão de rádio`);
            await radioButtons[radioButtons.length - 1].click(); // Click the last radio button
          }
  
          await delay(500);
        }
      }
      if (Object.keys(questionsAndAnswers).length > 0) {
        saveResponsesToFile(jobTitle, { ...savedResponses, ...questionsAndAnswers });
      }
    } catch (err) {
      console.log("Erro ao responder questionário: ", err);
    }
  }
  
export { applyForJobs, applyToJob, handleQuestionnaire, handleModal };

