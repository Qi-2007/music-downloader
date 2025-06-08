<template>
  <div v-if="songs.length > 0" id="results-container">
    <h2>搜索结果</h2>
    <ul>
      <li v-for="(song, index) in songs" :key="song.id"
          @dblclick="handleDoubleClick(index)"
          @click="handleClick(index)"
          :class="{ 'touch-active': isTouchDevice }"
      >
        <div class="song-info">
          <img :src="song.cover_url" alt="封面" width="50">
          <span>{{ song.name }} - {{ song.artist }}</span>
        </div>
        <div class="controls">
          <button @click.stop="$emit('download', song)">下载</button>
        </div>
      </li>
    </ul>
  </div>
  <div v-else-if="songs.length === 0 && Object.keys(songs).length > 0">
    <p>未找到相关歌曲。</p>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, onMounted, ref } from 'vue';

const props = defineProps({
  songs: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['download', 'play-song-from-list']);

const isTouchDevice = ref(false);

// 用于模拟双击的计时器和上一次点击时间
let lastClickTime = 0;
const DBLCLICK_THRESHOLD = 300; // 双击间隔阈值，单位毫秒

onMounted(() => {
  // 检测是否是触摸设备
  isTouchDevice.value = ('ontouchstart' in window) ||
                        (navigator.maxTouchPoints > 0) ||
                        (navigator.msMaxTouchPoints > 0);
});

// 处理单击事件
const handleClick = (index) => {
  if (isTouchDevice.value) {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < DBLCLICK_THRESHOLD) {
      // 认为是双击
      console.log('Touch double click detected for index:', index);
      emit('play-song-from-list', index);
      lastClickTime = 0; // 重置，避免三次点击
    } else {
      // 认为是单击，可以不触发任何动作，或者触发一个“选择”之类的轻量级动作
      console.log('Touch single click detected for index:', index);
      // 如果你想让单击也有一个提示，可以在这里添加，但通常双击和单击是互斥的
    }
    lastClickTime = currentTime;
  }
  // 桌面设备上的单击事件不在此处处理，因为我们会依赖 dblclick
};

// 处理双击事件 (主要用于桌面端)
const handleDoubleClick = (index) => {
  if (!isTouchDevice.value) {
    console.log('Desktop double click detected for index:', index);
    emit('play-song-from-list', index);
  }
};
</script>

<style scoped>
/* ... (你的 CSS 样式保持不变) */

/* 可以在这里添加一些触摸设备的视觉反馈，例如 active 状态 */
.touch-active li {
  /* 触摸设备上的列表项样式调整，例如增加点击区域 */
  cursor: pointer; /* 确保触摸设备上也有点击手势指示 */
}

/* 确保点击下载按钮不会触发播放 */
.controls button {
  /* ... */
  pointer-events: auto; /* 确保按钮可以被点击 */
}
</style>

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