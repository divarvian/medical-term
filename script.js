// --- Referensi Elemen DOM ---
const userInput = document.getElementById('userInput');
const explainBtn = document.getElementById('explainBtn');
const loadingDiv = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');
const errorDiv = document.getElementById('error');
const resultDiv = document.getElementById('result');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const translateBtn = document.getElementById('translateBtn');

// --- Konfigurasi & State ---
const API_URL = 'https://divarvian.my.id/replicate_api.php';
let currentEnglishExplanation = ""; // Menyimpan hasil penjelasan Inggris

// --- Event Listeners ---
explainBtn.addEventListener('click', handleGeneration);
translateBtn.addEventListener('click', handleTranslation);
copyBtn.addEventListener('click', copyToClipboard);
userInput.addEventListener('keyup', (event) => {
  if (event.key === "Enter") handleGeneration();
});

// --- Fungsi Utama ---

async function handleGeneration() {
  const inputText = userInput.value.trim();
  if (!inputText) {
    showError("Input istilah medis tidak boleh kosong.");
    return;
  }
  showLoading("AI sedang mencari jawaban terbaik...");

  const prompt = createExplanationPrompt(inputText);
  const resultData = await callApi(prompt);

  if (resultData) {
    currentEnglishExplanation = resultData.output.join('').trim();
    showResult(currentEnglishExplanation, true); // Tampilkan hasil & tombol terjemahan
  }
}

async function handleTranslation() {
  if (!currentEnglishExplanation) return;
  showLoading("Menerjemahkan ke Bahasa Indonesia...");

  const prompt = createTranslatePrompt(currentEnglishExplanation);
  const resultData = await callApi(prompt);

  if (resultData) {
    const translatedText = resultData.output.join('').trim();
    showResult(translatedText, false); // Tampilkan hasil terjemahan tanpa tombol
  }
}

async function callApi(prompt) {
  const payload = {
    input: {
      prompt: prompt,
      temperature: 0.2,
      max_tokens: 600,
      top_p: 0.9,
    }
  };
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || data.error || `HTTP error! status: ${response.status}`);
    }
    if (!data.output) {
      throw new Error("The AI response did not contain an output.");
    }
    return data;
  } catch (err) {
    showError(`An error occurred: ${err.message}`);
    return null;
  }
}

/**
 * Membuat prompt untuk menjelaskan istilah medis.
 * Prompt ini ringkas dan langsung ke intinya, memberikan konteks yang jelas (menjelaskan kepada orang awam).
 */
function createExplanationPrompt(term) {
  return `You are a helpful medical assistant explaining a term to someone with no medical background. 
Explain the medical term below in simple, clear English. 
Use an everyday analogy to make it easier to understand. 
Keep the explanation brief (2-3 sentences) and maintain a calm, reassuring tone. 
Avoid all medical jargon.

Medical Term: "${term}"

Simple Explanation:`;
}

/**
 * Membuat prompt untuk menerjemahkan teks.
 * Prompt ini menambahkan konteks bahwa terjemahan ditujukan untuk pasien, untuk menjaga nada yang tepat.
 */
function createTranslatePrompt(englishText) {
  return `Translate the following simple medical explanation into clear, natural Indonesian. 
It's for a patient, so keep the reassuring and easy-to-understand tone.

English Text: "${englishText}"

Indonesian Translation:`;
}


// --- Fungsi Bantuan UI ---

function copyToClipboard() {
  const textArea = document.createElement("textarea");
  textArea.value = resultText.innerText;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    }, 2000);
  } catch (err) {
    showError('Gagal menyalin teks.');
  }
  document.body.removeChild(textArea);
}

function showLoading(message) {
  loadingText.innerText = message;
  loadingDiv.classList.remove('hidden');
  resultDiv.classList.add('hidden');
  errorDiv.classList.add('hidden');
  translateBtn.classList.add('hidden');
}

function showResult(text, showTranslateButton) {
  loadingDiv.classList.add('hidden');
  errorDiv.classList.add('hidden');
  resultText.innerText = text;
  resultDiv.classList.remove('hidden');
  if (showTranslateButton) {
    translateBtn.classList.remove('hidden');
  } else {
    translateBtn.classList.add('hidden');
  }
}

function showError(message) {
  loadingDiv.classList.add('hidden');
  errorDiv.innerText = message;
  errorDiv.classList.remove('hidden');
  resultDiv.classList.add('hidden');
}