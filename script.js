const textarea = document.querySelector("textarea"),
  voiceList = document.querySelector("select"),
  speechBtn = document.querySelector("button"),
  repeatCountInput = document.getElementById("repeatCount");

let synth = speechSynthesis,
  isSpeaking = true;

voices();

function voices() {
  for (let voice of synth.getVoices()) {
    let selected = voice.name === "Google US English" ? "selected" : "";
    let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
    voiceList.insertAdjacentHTML("beforeend", option);
  }
}

synth.addEventListener("voiceschanged", voices);

function textToSpeech(text) {
  let utterance = new SpeechSynthesisUtterance(text);
  for (let voice of synth.getVoices()) {
    if (voice.name === voiceList.value) {
      utterance.voice = voice;
    }
  }
  return utterance;
}

speechBtn.addEventListener("click", (e) => {
  e.preventDefault();
  
  const text = textarea.value;
  const repeatCount = parseInt(repeatCountInput.value, 10);

  if (text !== "") {
    let currentRepeat = 0;
    
    // Function to play the speech in a loop
    function playSpeech() {
      if (currentRepeat < repeatCount) {
        const utterance = textToSpeech(text);
        utterance.onend = () => {
          currentRepeat++;
          if (currentRepeat < repeatCount) {
            playSpeech(); // Repeat until reaching the repeat count
          } else {
            speechBtn.innerText = "Convert To Speech";
          }
        };
        synth.speak(utterance);
      }
    }

    if (!synth.speaking) {
      playSpeech();
      speechBtn.innerText = "Playing...";
    }

    if (text.length > 80) {
      setInterval(() => {
        if (!synth.speaking && !isSpeaking) {
          isSpeaking = true;
          speechBtn.innerText = "Convert To Speech";
        }
      }, 500);
    }
  }
});
