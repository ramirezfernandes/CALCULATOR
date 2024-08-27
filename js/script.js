const result = document.querySelector(".result");
const calculationDiv = document.getElementById("calculation");
const buttons = document.querySelectorAll(".buttons button");

let currentNumber = "";
let previousNumber = "";
let operator = "";
let history = "";
let restart = false;

function updateResult(originClear = false) {
  result.innerText = originClear ? 0 : currentNumber.replace(".", ",");
}

function updateHistory() {
  calculationDiv.innerText = history;
}

function addDigit(digit) {
  if (restart) {
    currentNumber = digit;
    restart = false;
  } else {
    currentNumber += digit;
  }

  history += digit;
  updateResult();
  updateHistory();
}

function setOperator(newOperator) {
  if (restart) {
    previousNumber = currentNumber;
    history = currentNumber + " " + newOperator;
    restart = false;
  } else {
    if (previousNumber && operator && currentNumber) {
      calculate(false);
    } else if (currentNumber) {
      previousNumber = currentNumber;
    }

    history += ` ${newOperator} `;
  }

  operator = newOperator;
  currentNumber = "";
  updateHistory();
}

function calculate(finalCalculation = true) {
  if (!previousNumber || !operator || !currentNumber) return;

  const num1 = parseFloat(previousNumber.replace(",", "."));
  const num2 = parseFloat(currentNumber.replace(",", "."));
  let calculationResult;

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

  currentNumber = calculationResult.toString().replace(".", ",");
  updateResult();

  if (finalCalculation) {
    history += ` = ${currentNumber}`;
    updateHistory();
    resetCalculator(false);
  } else {
    previousNumber = currentNumber;
    currentNumber = "";
    updateHistory();
  }
}

function resetCalculator(clearHistory = true) {
  previousNumber = "";
  operator = "";
  restart = true;
  if (clearHistory) history = "";
}

function clearCalculator() {
  currentNumber = "";
  previousNumber = "";
  operator = "";
  history = "";
  updateResult(true);
  updateHistory();
}

function setPercentage() {
  if (!currentNumber || !previousNumber || !operator) return;

  const base = parseFloat(previousNumber.replace(",", "."));
  const percentage = parseFloat(currentNumber.replace(",", "."));
  currentNumber = ((base * percentage) / 100).toString().replace(".", ",");

  updateResult(); // Exibe o valor da porcentagem no resultado principal, não no histórico
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonText = button.innerText;
    if (/^[0-9,]+$/.test(buttonText)) {
      addDigit(buttonText);
    } else if (["+", "-", "×", "÷"].includes(buttonText)) {
      setOperator(buttonText);
    } else if (buttonText === "=") {
      calculate();
    } else if (buttonText === "C") {
      clearCalculator();
    } else if (buttonText === "±") {
      currentNumber = (parseFloat(currentNumber || "0") * -1).toString().replace(".", ",");
      updateResult();
    } else if (buttonText === "%") {
      setPercentage();
      history += " %"; // Adiciona o símbolo de porcentagem ao histórico
      updateHistory(); // Atualiza o histórico corretamente
    }
  });
});
