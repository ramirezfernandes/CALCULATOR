const result = document.querySelector(".result");
const calculationDiv = document.getElementById("calculation");
const buttons = document.querySelectorAll(".buttons button");

let currentNumber = "";
let calculation = ""; // Armazena o cálculo completo
let lastOperator = null; // Armazena o último operador usado
let restart = false; // Controla se o cálculo deve reiniciar

function updateResult(originClear = false) {
  result.innerText = originClear ? 0 : currentNumber.replace(".", ",");
}

function updateCalculation() {
  calculationDiv.innerText = calculation; // Atualiza o cálculo exibido
}

function addDigit(digit) {
  if (digit === "," && (currentNumber.includes(",") || !currentNumber)) return;

  if (restart) {
    currentNumber = digit;
    restart = false;
  } else {
    currentNumber += digit;
  }
  updateResult();
}

function setOperator(newOperator) {
  if (currentNumber) {
    if (lastOperator && !restart) {
      calculation += ` ${currentNumber.replace(",", ".")}`;
      calculate(); // Calcula o resultado parcial
    } else {
      calculation += ` ${currentNumber.replace(",", ".")}`;
    }
  }
  calculation += ` ${newOperator}`;
  lastOperator = newOperator;
  currentNumber = "";
  restart = false;
  updateCalculation();
}

function calculate() {
  if (!lastOperator || !currentNumber) return; // Previne cálculo se não há novo número ou operador

  calculation += ` ${currentNumber.replace(",", ".")}`;
  try {
    const resultValue = eval(calculation.replace(/×/g, "*").replace(/÷/g, "/"));
    currentNumber = resultValue.toString();
    updateResult();
    calculation = currentNumber; // Reinicia o cálculo com o resultado
    restart = true; // Marca que o próximo dígito deve reiniciar a entrada
    lastOperator = null; // Reseta o último operador
    updateCalculation();
  } catch (error) {
    result.innerText = "Erro";
    calculation = ""; // Limpa a expressão
  }
}

function clearCalculator() {
  currentNumber = "";
  calculation = "";
  lastOperator = null;
  updateResult(true);
  updateCalculation();
}

function setPercentage() {
  let result = parseFloat(currentNumber) / 100;

  if (lastOperator === "+" || lastOperator === "-") {
    result *= eval(calculation.replace(/×/g, "*").replace(/÷/g, "/"));
  }

  currentNumber = result.toString();
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
      calculate();
    } else if (buttonText === "C") {
      clearCalculator();
    } else if (buttonText === "±") {
      currentNumber = (
        parseFloat(currentNumber || "0") * -1
      ).toString();
      updateResult();
    } else if (buttonText === "%") {
      setPercentage();
    }
  });
});
