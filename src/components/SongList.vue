<template>
  <div v-if="songs.length > 0" id="results-container">
    <h2>搜索结果</h2>
    <ul>
      <li v-for="(song, index) in songs" :key="song.id" @dblclick="$emit('play-song-from-list', index)">
        <div class="song-info">
          <img :src="song.cover_url" alt="封面" width="50">
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
  border-top: 1px solid #aaa; /* 将 #eee 替换为 #aaa */
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

.song-info img {
    margin-right: 10px;
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

/* 针对较窄屏幕 (< 400px) 的样式 */
@media (max-width: 399px) {
  li {
    flex-direction: column; /* 垂直排列 song-info 和 controls */
    align-items: center; /* 水平居中子元素 */
    padding: 10px; /* 可以添加一些内边距，使内容不紧贴边缘 */
    text-align: center; /* 如果需要，可以使 li 内部文本也居中 */
  }

  .song-info {
    width: 100%; /* 占据全部宽度 */
    flex-direction: column; /* 垂直排列图片和文字 */
    align-items: center; /* 水平居中图片和文字 */
    margin-bottom: 10px; /* 给 song-info 增加下边距 */
    text-align: center; /* 居中内部文本 */
  }

  .song-info img {
    margin-right: 0;
  }

  .song-info span {
    text-align: center; /* 确保文字居中 */
  }

  .controls {
    width: 100%; /* 占据全部宽度 */
    flex-direction: row; /* 按钮水平排列 */
    justify-content: center; /* 按钮水平居中 */
  }

  .controls button {
    margin: 0; /* 移除左边的 margin，实现去除左边填充的效果 */
    font-size: 0.8em;
    padding: 8px 12px; /* 适当调整按钮内边距 */
  }
}
</style>