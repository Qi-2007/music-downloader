<template>
    <div id="player-container" v-if="audioList.length > 0">
      <h2>音乐播放器</h2>
      <div id="aplayer" ref="playerContainer"></div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, onMounted, onUnmounted, ref, watch } from 'vue';
  
  const props = defineProps({
    audioList: {
      type: Array,
      default: () => [],
    },
  });
  
  const ap = ref(null);
  const playerContainer = ref(null);
  
  onMounted(() => {
    initializeAPlayer();
  });
  
  watch(() => props.audioList, initializeAPlayer, { deep: true, immediate: true });
  
  onUnmounted(() => {
    if (ap.value) {
      ap.value.destroy();
    }
  });
  
  function initializeAPlayer() {
    if (props.audioList.length > 0 && playerContainer.value) {
      if (ap.value) {
        ap.value.destroy();
        ap.value = null;
      }
      ap.value = new APlayer({
        container: playerContainer.value,
        mini: false,
        autoplay: false,
        theme: '#FADFA3',
        loop: 'all',
        order: 'random',
        preload: 'auto',
        volume: 0.7,
        mutex: true,
        listFolded: false,
        listMaxHeight: 90,
        lrcType: 1, // 修改为 1 以显示普通歌词
        audio: props.audioList,
      });
  
      ap.value.on('loadedmetadata', () => {
        console.log('APlayer loaded metadata:', ap.value.audio.current);
      });
  
      ap.value.on('error', () => {
        console.error('APlayer error occurred:', ap.value.audio.current);
      });
    } else if (ap.value) {
      ap.value.destroy();
      ap.value = null;
    }
  }
  </script>
  
  <style scoped>
  #player-container {
    padding: 20px;
    margin-top: 20px;
    border-top: 1px solid #eee;
  }
  
  #aplayer {
    margin-bottom: 10px;
  }
  </style>