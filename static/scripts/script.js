const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

let wordList;

function fetchWords() {
  fetch("/dictionary/words.txt")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.text();
    })
    .then((data) => {
      wordList = data.split("\n").map((value, index) => value.toLowerCase());
    })
    .catch((error) => {console.error("Unable to fetch data:", error)});
}

fetchWords();

function search(pattern, includedLetters) {
  let lengthOfWord = pattern.length;
  let availableResultLists = wordList.filter(word => word.length == lengthOfWord);

  let presentChars = new Set(pattern);
  for (let letterIndex in pattern) {
    let currentChar = pattern.charAt(letterIndex).toLowerCase();
    if (currentChar == "_") continue;

    availableResultLists = availableResultLists.filter(word => {
      let char = word.charAt(letterIndex);
      return (
        char == currentChar &&
        presentChars.has(char)
      )
    });
  }

  for (let letter of includedLetters) {
    availableResultLists = availableResultLists.filter(word => word.includes(letter));
  }

  console.log(availableResultLists);
}

function searchButtonClick() {
  let pattern = document.querySelector("input#word-patterns").value;
  let includedLetters = document.querySelector("input#included-letters").value.split(" ");

  search(pattern, includedLetters);
}