// Seleciona o elemento que exibirá o resultado da calculadora
const result = document.querySelector(".result");

// Seleciona o elemento que exibirá o histórico de cálculos
const calculationDiv = document.getElementById("calculation");

// Seleciona todos os botões dentro da div com a classe "buttons"
const buttons = document.querySelectorAll(".buttons button");


let currentNumber = ""; // Variáveis para armazenar o número atual
let previousNumber = ""; // Variáveis para armazenar o número o número anterior
let operator = ""; // Variáveis para armazenar o o operador
let history = ""; // Variáveis para armazenar o histórico da operação
let restart = false; // Flag para reiniciar o número atual após uma operação

// Atualiza o valor exibido no resultado, formatando a exibição se necessário
function updateResult(originClear = false) {
  result.innerText = originClear ? 0 : currentNumber.replace(".", ",");
}

// Atualiza o histórico de operações exibido
function updateHistory() {
  calculationDiv.innerText = history;
}

// Adiciona dígitos ao número atual e atualiza a exibição do resultado e do histórico
function addDigit(digit) {
  if (restart) { // Se estiver reiniciando, o número atual é substituído
    currentNumber = digit;
    restart = false;
  } else {
    currentNumber += digit; // Caso contrário, o dígito é adicionado ao final do número atual
  }

  history += digit; // Adiciona o dígito ao histórico
  updateResult(); // Atualiza a exibição do resultado
  updateHistory(); // Atualiza a exibição do histórico
}

// Define o operador para a operação atual e lida com a lógica de cálculos pendentes
function setOperator(newOperator) {
  if (restart) { // Se estiver reiniciando, o número anterior é definido como o número atual
    previousNumber = currentNumber;
    history = currentNumber + " " + newOperator;
    restart = false;
  } else {
    if (previousNumber && operator && currentNumber) {
      calculate(false); // Realiza o cálculo se há um operador e dois números
    } else if (currentNumber) {
      previousNumber = currentNumber; // Caso contrário, armazena o número atual como o número anterior
    }

    history += ` ${newOperator} `; // Adiciona o operador ao histórico
  }

  operator = newOperator; // Define o operador
  currentNumber = ""; // Reseta o número atual
  updateHistory(); // Atualiza a exibição do histórico
}

// Realiza o cálculo com os números e o operador definidos
function calculate(finalCalculation = true) {
  if (!previousNumber || !operator || !currentNumber) return; // Verifica se há um cálculo para fazer

  // Converte os números para ponto flutuante
  const num1 = parseFloat(previousNumber.replace(",", "."));
  const num2 = parseFloat(currentNumber.replace(",", "."));
  let calculationResult;

  // Realiza a operação com base no operador
  switch (operator) {
    case "+":
      calculationResult = num1 + num2;
      break;
    case "-":
      calculationResult = num1 - num2;
      break;
    case "×":
      calculationResult = num1 * num2;
      break;
    case "÷":
      calculationResult = num1 / num2;
      break;
    default:
      return;
  }

  // Converte o resultado para string e formata
  currentNumber = calculationResult.toString().replace(".", ",");
  updateResult(); // Atualiza a exibição do resultado

  if (finalCalculation) {
    history += ` = ${currentNumber}`; // Adiciona o resultado ao histórico
    updateHistory(); // Atualiza a exibição do histórico
    resetCalculator(false); // Reseta a calculadora, mantendo o histórico
  } else {
    previousNumber = currentNumber; // Caso não seja o cálculo final, armazena o resultado como número anterior
    currentNumber = ""; // Reseta o número atual
    updateHistory(); // Atualiza a exibição do histórico
  }
}

// Reseta a calculadora, limpando os valores armazenados e, opcionalmente, o histórico
function resetCalculator(clearHistory = true) {
  previousNumber = "";
  operator = "";
  restart = true; // Define a flag de reinício
  if (clearHistory) history = ""; // Limpa o histórico se solicitado
}

// Limpa totalmente a calculadora, incluindo o histórico
function clearCalculator() {
  currentNumber = "";
  previousNumber = "";
  operator = "";
  history = "";
  updateResult(true); // Reseta a exibição do resultado para zero
  updateHistory(); // Reseta o histórico
}

// Calcula a porcentagem do número atual em relação ao número anterior
function setPercentage() {
  if (!currentNumber || !previousNumber || !operator) return; // Verifica se há valores suficientes para calcular a porcentagem

  // Calcula a porcentagem
  const base = parseFloat(previousNumber.replace(",", "."));
  const percentage = parseFloat(currentNumber.replace(",", "."));
  currentNumber = ((base * percentage) / 100).toString().replace(".", ",");

  updateResult(); // Exibe o valor da porcentagem no resultado principal, não no histórico
}

// Adiciona eventos de clique a cada botão da calculadora
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonText = button.innerText; // Obtém o texto do botão clicado
    if (/^[0-9,]+$/.test(buttonText)) { // Verifica se o botão clicado é um número ou vírgula
      addDigit(buttonText); // Adiciona o dígito ao número atual
    } else if (["+", "-", "×", "÷"].includes(buttonText)) { // Verifica se o botão clicado é um operador
      setOperator(buttonText); // Define o operador
    } else if (buttonText === "=") { // Verifica se o botão clicado é o botão de igual
      calculate(); // Realiza o cálculo
    } else if (buttonText === "C") { // Verifica se o botão clicado é o botão de limpar
      clearCalculator(); // Limpa a calculadora
    } else if (buttonText === "±") { // Verifica se o botão clicado é o botão de mudar o sinal do número
      currentNumber = (parseFloat(currentNumber || "0") * -1).toString().replace(".", ",");
      updateResult(); // Atualiza o resultado com o novo valor
    } else if (buttonText === "%") { // Verifica se o botão clicado é o botão de porcentagem
      setPercentage(); // Calcula a porcentagem
      history += " %"; // Adiciona o símbolo de porcentagem ao histórico
      updateHistory(); // Atualiza o histórico corretamente
    }
  });
});
