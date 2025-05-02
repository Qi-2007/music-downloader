<template>
  <div v-if="songs.length > 0" id="results-container">
    <h2>搜索结果</h2>
    <ul>
      <li v-for="(song, index) in songs" :key="song.id" @dblclick="$emit('play-song-from-list', index)">
        <div class="song-info">
          <img :src="song.cover_url" alt="封面" width="50" style="margin-right: 10px;">
          <span>{{ song.name }} - {{ song.artist }}</span>
        </div>
        <div class="controls">
          <button @click="$emit('download', song)">下载</button>
        </div>
      </li>
    </ul>
  </div>
  <div v-else-if="songs.length === 0 && Object.keys(songs).length > 0">
    <p>未找到相关歌曲。</p>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
  songs: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['download', 'play-song-from-list']);
</script>

<style scoped>
#results-container {
  padding: 20px;
  margin-top: 20px;
  border-top: 1px solid #eee;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

li:last-child {
  border-bottom: none;
}

.song-info {
  display: flex;
  align-items: center;
  flex-grow: 1; /* 让 span 占据剩余空间 */
}

.song-info span {
  flex-grow: 1;
  text-align: center;
}

.controls button {
  padding: 8px 15px;
  margin-left: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap; /* 防止按钮文本换行 */
}

.controls button:hover {
  background-color: #1e7e34;
}
</style>