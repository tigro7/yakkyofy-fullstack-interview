<script setup lang="ts">
  const route = useRoute()
  const urlInput = ref('')
  const feedback = ref('')
  const imageUrl = ref('')
  const pollingInterval = 5000;
  let pollingTimer : NodeJS.Timeout | null = null;

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!urlInput.value || !validateUrl(urlInput.value)) {
      feedback.value = 'Please enter a valid URL'
      return
    }
    try{
      const response = await fetch('http://localhost:3000/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: urlInput.value })
      })
      const data = await response.json()
      
      clearPolling();

      const screenshotId = data.id;
      localStorage.setItem('screenshotId', screenshotId);

      feedback.value = `Process queued successfully! Screenshot ID: ${screenshotId}`;

      startPolling();
    } catch (error) {
      console.error('Error queuing screenshot:', error);
      feedback.value = 'An error occurred during queuing';
    } finally {
      urlInput.value = '';
      imageUrl.value = '';
    }
}

const pollStatus = async () => {
  if (!localStorage.getItem('screenshotId')) {
    return;
  }

  try{
    const response = await fetch(`http://localhost:3000/screenshot/${localStorage.getItem('screenshotId')}`);
    const data = await response.json();
    const { status, file } = data;

    if (status == 'done'){
      if (file) {
        // Converti il buffer in base64
        const imgSrc = `data:image/png;base64,${file.toString('base64')}`

        //mostra lo screenshot
        imageUrl.value = imgSrc;
      } else {
        console.error('No file found in the response.');
        throw new Error('No file found in the response.');
      }

      feedback.value = 'Screenshot is ready!';

      //svuota il localStorage
      localStorage.removeItem('screenshotId');
      clearPolling();
    }else if (status == 'queued'){
      feedback.value = 'Screenshot status is still queued, reloading in 5 seconds...';  
    }else if (status == 'processing'){
      feedback.value = 'Screenshot status is still processing, reloading in 5 seconds...';
    }
  }catch (error){
    console.error('Error polling screenshot status:', error);
    feedback.value = 'An error occurred during polling';
  }
}

//funzione per l'inizio del polling
const startPolling = () => {
  //permetti solo un polling
  if (pollingTimer == null) {
    pollingTimer = setInterval(pollStatus, pollingInterval);
  }
}

//funzione per eliminare il polling
const clearPolling = () => {
  if (pollingTimer != null) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

//quando la pagina viene caricata, inizia il polling
onMounted(() => {
  //inizia il polling solo se c'è uno screenshot nello storage
  if (localStorage.getItem('screenshotId')) {
    feedback.value = 'Resuming polling...';
    startPolling();
  }
})

//quando la pagina viene distrutta, elimina il polling
onUnmounted(() => {
  clearPolling();
})

</script>

<template>
  <div>
    <h1>Screenshot Interview</h1>
    <form @submit.prevent="handleSubmit">
      <label for="urlInput">URL</label>
      <input type="text" id="url" v-model="urlInput" placeholder="Enter a valid URL" required />
      <button type="submit">Take Screenshot</button>
    </form>
    <p v-if="feedback">
      {{ feedback }}
    </p>
    <div v-if="imageUrl">
      <img :src="imageUrl" alt="Screenshot" />
    </div>
  </div>
</template>
