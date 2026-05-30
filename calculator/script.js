/* ============================================================
   Sunburst Calculator — script.js
   Minimal JavaScript: only handles calculator logic.
   ============================================================ */

// Grab DOM elements
const expressionEl = document.getElementById("expression");
const resultEl     = document.getElementById("result");
const buttons      = document.querySelectorAll(".btn");
const yearEl       = document.getElementById("year");

// Footer year
yearEl.textContent = new Date().getFullYear();

// Calculator state
let expression = "";   // what the user is typing, e.g. "12+5*2"
let lastResult = "0";  // last computed value

// Operators we accept
const operators = ["+", "-", "*", "/", "%"];

/* Render the display */
function render() {
  expressionEl.textContent = formatForDisplay(expression) || "0";
  resultEl.textContent     = lastResult;
}

/* Replace internal operators with pretty symbols for display */
function formatForDisplay(str) {
  return str
    .replace(/\*/g, " × ")
    .replace(/\//g, " ÷ ")
    .replace(/-/g, " − ")
    .replace(/\+/g, " + ");
}

/* Append a value (number, dot, or operator) */
function appendValue(value) {
  const lastChar = expression.slice(-1);

  // Prevent two operators in a row — replace the previous one
  if (operators.includes(value) && operators.includes(lastChar)) {
    expression = expression.slice(0, -1) + value;
    render();
    return;
  }

  // Prevent starting with an operator (except minus for negatives)
  if (expression === "" && operators.includes(value) && value !== "-") return;

  // Prevent multiple dots within the same number
  if (value === ".") {
    const parts = expression.split(/[\+\-\*\/%]/);
    const currentNumber = parts[parts.length - 1];
    if (currentNumber.includes(".")) return;
    if (currentNumber === "") value = "0.";
  }

  expression += value;
  render();
}

/* Delete the last character */
function deleteLast() {
  expression = expression.slice(0, -1);
  render();
}

/* Clear everything */
function clearAll() {
  expression = "";
  lastResult = "0";
  render();
}

/* Evaluate the expression safely */
function calculate() {
  if (!expression) return;

  try {
    // Convert "50%" patterns to "(50/100)" for percentage handling
    const safeExpr = expression.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

    // Function constructor is safer than eval and limited to math here
    const value = Function('"use strict"; return (' + safeExpr + ")")();

    if (value === Infinity || value === -Infinity || isNaN(value)) {
      lastResult = "Error";
    } else {
      // Round to avoid floating-point noise like 0.1 + 0.2 = 0.30000000000000004
      lastResult = String(Math.round(value * 1e10) / 1e10);
    }

    // Flash animation on result
    resultEl.classList.remove("flash");
    void resultEl.offsetWidth; // restart animation
    resultEl.classList.add("flash");
  } catch (e) {
    lastResult = "Error";
  }

  render();
}

/* Wire up button clicks */
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    const value  = btn.dataset.value;

    if (action === "clear")  return clearAll();
    if (action === "delete") return deleteLast();
    if (action === "equals") return calculate();
    if (value !== undefined) appendValue(value);
  });
});

/* Bonus: keyboard support */
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if ((key >= "0" && key <= "9") || key === "." ||
      key === "+" || key === "-" || key === "*" ||
      key === "/" || key === "%") {
    appendValue(key);
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearAll();
  }
});

// Initial render
render();