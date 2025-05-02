<template>
  <div v-if="!isAuthenticated">
    <h2>请输入密码</h2>
    <input type="password" v-model="password" @keyup.enter="handlePasswordLogin" />
    <button @click="handlePasswordLogin">登录</button>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
  <div v-else style="display: flex; flex-direction: column; align-items: center;">
    <div>
      <label for="source">选择音乐来源:</label>
      <select id="source" v-model="selectedSource" @change="() => console.log('Selected Source:', selectedSource.value)">
        <option value="kuwo">酷我</option>
        <option value="kugou">酷狗</option>
        <option value="netease">网易云音乐</option>
      </select>
    </div>
    <div>
      <label for="bitrate">选择音质:</label>
      <select id="bitrate" v-model="selectedBitrate" @change="() => console.log('Selected Bitrate:', selectedBitrate)">
        <option value="128kmp3">128kbps MP3</option>
        <option value="320kmp3">320kbps MP3</option>
        <option value="2000kflac">2000kbps FLAC</option>
      </select>
    </div>
    <Search :source="selectedSource" @search-results="handleSearchResults" style="width: 80%; max-width: 960px; margin: 20px auto 0;" />
    <div class="player-list-container" style="width: 80%; max-width: 960px; margin: 20px auto 0;">
      <SongList :songs="searchResults" @download="downloadSong" @play-song-from-list="playSongFromList" class="song-list-item" />
      <Player :audioList="aplayerAudioList" v-if="aplayerAudioList.length > 0" ref="playerRef" class="player-item" />
    </div>
    <Footer style="margin-top: 40px;" />
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue';
import Footer from './Footer.vue';
import Player from './Player.vue';
import Search from './Search.vue';
import SongList from './SongList.vue';

const API_BASE_URL = inject('API_BASE_URL');

const isAuthenticated = ref(false);
const password = ref('');
const errorMessage = ref('');
const searchResults = ref([]);
const aplayerAudioList = ref([]);
const selectedSource = ref('kuwo');
const selectedBitrate = ref('128kmp3');
const playerRef = ref(null); // 用于引用 Player 组件实例

const getCookie = (name) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

const authenticate = async (loginPassword = null) => {
  try {
    const formData = new URLSearchParams();
    if (loginPassword) {
      formData.append('password', loginPassword);
    }
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: 'include',
    });
    const data = await response.json();
    if (data.token) {
      isAuthenticated.value = true;
      password.value = '';
      errorMessage.value = '';
    } else {
      errorMessage.value = data.error || '认证失败';
    }
  } catch (error) {
    console.error('Authentication error:', error);
    errorMessage.value = '认证失败，请检查网络。';
  }
};

const handlePasswordLogin = () => {
  authenticate(password.value);
};

const handleSearchResults = async (results) => {
  searchResults.value = results.map(song => ({ ...song, source: selectedSource.value }));
  console.log('Search Results in Auth:', searchResults.value);
  aplayerAudioList.value = await Promise.all(results.map(async (song, index) => { // 传递 index
    try {
      const lyricResponse = await fetch(`${API_BASE_URL}/lyric/${song.id}?source=${selectedSource.value}`, { credentials: 'include' });
      const lyricData = await lyricResponse.json();
      return {
        name: song.name,
        artist: song.artist,
        url: `${API_BASE_URL}/download/${song.id}?source=${selectedSource.value}&br=${selectedBitrate.value}`,
        cover: song.cover_url,
        lrc: lyricData.lrc || '',
        index: index, // 保存索引
      };
    } catch (error) {
      console.error('Error fetching audio or lyric for song:', song.name, error);
      return null;
    }
  })).then(list => list.filter(item => item !== null));
  console.log('aplayerAudioList in Auth:', aplayerAudioList.value);
};

const downloadSong = (song) => {
  window.location.href = `${API_BASE_URL}/download/${song.id}?source=${song.source}&br=${selectedBitrate.value}`;
};

const playSongFromList = (index) => {
  console.log('父组件接收到播放请求，索引:', index);
  if (playerRef.value && playerRef.value.aplayerInstance) {
    playerRef.value.aplayerInstance.list.switch(index);
    playerRef.value.aplayerInstance.play();
  } else {
    console.warn('Player 组件实例或 aplayerInstance 不存在。');
  }
};

onMounted(() => {
  const token = getCookie('token');
  if (token) {
    authenticate();
  }
});
</script>

<style scoped>
#auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
}

#auth-container > div {
  margin-bottom: 15px;
}

label {
  margin-right: 10px;
}

select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input[type="password"] {
  padding: 10px;
  margin-bottom: 10px;
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

.player-list-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
  max-width: 960px;
  margin-top: 20px;
  /* 确保内容从左侧开始排列，并且不溢出 */
  justify-content: flex-start;
  overflow-x: auto; /* 如果内容超出容器宽度，允许水平滚动 */
}

.song-list-item {
  flex: 1;
  min-width: 0; /* 允许内容缩小 */
  box-sizing: border-box; /* 包含 padding 和 border 在元素尺寸内 */
}

.player-item {
  flex: 1;
  min-width: 0; /* 允许内容缩小 */
  box-sizing: border-box; /* 包含 padding 和 border 在元素尺寸内 */
}

/* 针对子元素内部的内容，确保不溢出 */
.song-info {
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 使用省略号表示溢出 */
  white-space: nowrap; /* 防止文本换行 */
}

/* 在小屏幕上垂直排列 */
@media (max-width: 768px) {
  .player-list-container {
    flex-direction: column;
    align-items: stretch;
    overflow-x: auto; /* 竖屏也允许水平滚动，以防万一 */
  }

  .song-list-item,
  .player-item {
    width: 100%;
    min-width: auto;
    margin-bottom: 20px;
  }

  .player-item:last-child {
    margin-bottom: 0;
  }
}
</style>