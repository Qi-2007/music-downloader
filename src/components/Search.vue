<template>
    <div id="search-container">
      <input type="text" v-model="searchTerm" placeholder="搜索歌曲..." @keyup.enter="search" />
      <button @click="search">搜索</button>
    </div>
  </template>
  
  <script setup>
  import { defineEmits, defineProps, inject, ref } from 'vue';
  
  const API_BASE_URL = inject('API_BASE_URL');
  
  const searchTerm = ref('');
  const emit = defineEmits(['search-results']);
  const props = defineProps({
    source: {
      type: String,
      required: true,
    },
  });
  
  const search = async () => {
    if (searchTerm.value) {
      try {
        const response = await fetch(`${API_BASE_URL}/search?keyword=${searchTerm.value}&source=${props.source}`,{credentials: 'include',});
        const data = await response.json();
        emit('search-results', data || []);
        searchTerm.value = '';
      } catch (error) {
        console.error('Search error:', error);
        emit('search-results', []);
      }
    }
  };
  </script>
  
  <style scoped>
  #search-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    width: 100%;
    max-width: 960px;
  }
  
  input[type="text"] {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>