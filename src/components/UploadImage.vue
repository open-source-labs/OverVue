<template>
  <div class="home-sidebar">
    <q-uploader
      url="http://localhost:4444/upload"
      label="Upload Image Mockups"
      color="teal"
      flat
      bordered
      style="max-width: 100%"
      accept=".jpg, image/*"
    />
  </div>
</template>

<style>
.home-sidebar {
  margin: 1rem;
  border-radius: 5px;
}
</style>
