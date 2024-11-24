// Function to toggle visibility of sections
function showSection(sectionToShowId) {
  // Get all sections
  const sections = document.querySelectorAll(".section");

  // Hide all sections first
  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  // Show the requested section
  const sectionToShow = document.getElementById(sectionToShowId);
  if (sectionToShow) {
    sectionToShow.classList.remove("hidden");
  }
}

// Fetch word definition
async function fetchWordDefinition(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!response.ok) throw new Error("Word not found");

    const data = await response.json();
    displayWordDefinition(data);
  } catch (error) {
    document.getElementById(
      "word-output"
    ).innerHTML = `<p>${error.message}</p>`;
  }
}

// Display the word definition
function displayWordDefinition(data) {
  const wordData = data[0];
  const word = wordData.word;
  const phonetics = wordData.phonetics
    .map((phonetic) => {
      return `
        <p>
          <strong>Text:</strong> ${phonetic.text || "N/A"} <br>
          ${
            phonetic.audio
              ? `<audio controls src="${phonetic.audio}"></audio>`
              : "Audio unavailable"
          }
        </p>
      `;
    })
    .join("");

  const meanings = wordData.meanings
    .map((meaning) => {
      const definitions = meaning.definitions
        .map(
          (definition) =>
            `<li>
              <strong>Definition:</strong> ${definition.definition}<br>
              ${
                definition.example
                  ? `<strong>Example:</strong> ${definition.example}`
                  : ""
              }
            </li>`
        )
        .join("");

      return `
        <div>
          <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
          <ul>${definitions}</ul>
        </div>
      `;
    })
    .join("");

  const sourceUrls = wordData.sourceUrls
    .map((url) => `<a href="${url}" target="_blank">${url}</a>`)
    .join(", ");

  document.getElementById("word-output").innerHTML = `
    <h2>${word.toUpperCase()}</h2>
    <div>
      <h3>Phonetics</h3>
      ${phonetics}
    </div>
    <div>
      <h3>Meanings</h3>
      ${meanings}
    </div>
    <div>
      <h3>Source</h3>
      ${sourceUrls}
    </div>
  `;
}

// Fetch trivia question
async function fetchTriviaQuestion() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple"
    );
    const data = await response.json();

    if (data.response_code !== 0) {
      throw new Error("Failed to fetch trivia question.");
    }

    displayTriviaQuestion(data.results[0]);
  } catch (error) {
    document.getElementById(
      "trivia-output"
    ).innerHTML = `<p>Error loading trivia. Try again!</p>`;
    console.error(error); // Log error for debugging
  }
}

// Display the trivia question
function displayTriviaQuestion(question) {
  const triviaOutput = document.getElementById("trivia-output");
  const skipButton = document.getElementById("skip-trivia-btn");

  // Show the Skip button
  skipButton.classList.remove("hidden");

  // Prepare answers
  const answers = [
    ...question.incorrect_answers,
    question.correct_answer,
  ].sort();

  // Display trivia question and answers
  triviaOutput.innerHTML = `
    <h3>${question.question}</h3>
    ${answers
      .map(
        (answer) =>
          `<button class="answer-btn" type="button" onclick="checkTriviaAnswer('${answer}', '${question.correct_answer}')">${answer}</button>`
      )
      .join("")}
  `;

  // Bind Skip button to fetch a new question
  skipButton.onclick = () => {
    fetchTriviaQuestion();
  };
}

// Check trivia answer
function checkTriviaAnswer(selected, correct) {
  const triviaOutput = document.getElementById("trivia-output");
  const feedback =
    selected === correct
      ? "Correct!"
      : `Wrong! The correct answer is: ${correct}`;
  triviaOutput.innerHTML += `<p><strong>${feedback}</strong></p>`;

  // Hide the Skip button after an answer is selected
  document.getElementById("skip-trivia-btn").classList.add("hidden");
}

// Event Listeners for navigation and actions
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the Word Lookup section as visible
  showSection("word-section");

  // Navigation setup
  document.getElementById("nav-word").addEventListener("click", (event) => {
    event.preventDefault();
    showSection("word-section");
  });

  document.getElementById("nav-trivia").addEventListener("click", (event) => {
    event.preventDefault();
    showSection("trivia-section");
  });

  // Event listeners for specific actions
  document
    .getElementById("new-trivia-btn")
    .addEventListener("click", fetchTriviaQuestion);

  document.getElementById("word-search-btn").addEventListener("click", () => {
    const word = document.getElementById("word-input").value;
    if (word.trim() === "") {
      alert("Please enter a word!");
      return;
    }
    fetchWordDefinition(word); // Call the function to fetch word data
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    alert("You have logged out successfully!");
    window.location.href = "../index.html"; // Replace with the actual login page
  });
});
