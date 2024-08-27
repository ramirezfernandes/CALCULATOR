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
    history = ""; // Reseta o histórico ao iniciar nova operação
  } else {
    currentNumber += digit;
  }
  
  history += digit; // Adiciona o dígito ao histórico
  updateResult();
  updateHistory(); // Atualiza o histórico enquanto digita
}

function setOperator(newOperator) {
  if (!currentNumber && !previousNumber) return;

  if (previousNumber && currentNumber) {
    calculate(false);
  } else if (currentNumber) {
    previousNumber = currentNumber;
  }

  operator = newOperator;
  history += ` ${operator}`;
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
    resetCalculator();
  } else {
    previousNumber = currentNumber;
    history += ` ${currentNumber} ${operator}`;
    currentNumber = "";
    updateHistory();
  }
}

function resetCalculator() {
  previousNumber = "";
  operator = "";
  restart = true;
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
  if (!currentNumber) return;
  
  currentNumber = (parseFloat(currentNumber.replace(",", ".")) / 100).toString().replace(".", ",");
  updateResult();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonText = button.innerText;
    if (/^[0-9,]+$/.test(buttonText)) {
      addDigit(buttonText);
    } else if (["+", "-", "×", "÷"].includes(buttonText)) {
      setOperator(buttonText);
    } else if (buttonText === "=") {
      calculate(); // Calcula o resultado final e exibe o histórico completo
    } else if (buttonText === "C") {
      clearCalculator();
    } else if (buttonText === "±") {
      currentNumber = (parseFloat(currentNumber || "0") * -1).toString().replace(".", ",");
      updateResult();
    } else if (buttonText === "%") {
      setPercentage();
    }
  });
});
