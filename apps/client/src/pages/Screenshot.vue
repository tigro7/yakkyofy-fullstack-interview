<script setup lang="ts">
  const route = useRoute()
  const urlInput = ref('')
  const feedback = ref('')
  const imageUrl = ref('')
  const handleSubmit = async () => {
    if (!urlInput.value) {
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

      const screenshotId = data.id;
      localStorage.setItem('screenshotId', screenshotId);

      feedback.value = `Process queued successfully! Screenshot ID: ${screenshotId}`;
    } catch (error) {
      console.error('Error queuing screenshot:', error);
      feedback.value = 'An error occurred'
    }
}
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
