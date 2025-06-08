<script setup>
import { inject, onMounted, ref, watch } from 'vue';
import Footer from './Footer.vue';
import Player from './Player.vue';
import Search from './Search.vue';
import SongList from './SongList.vue';

const API_BASE_URL = inject('API_BASE_URL');

const isAuthenticated = ref(false);
const password = ref('');
const errorMessage = ref('');
const searchResults = ref([]); // Stores raw search results
const aplayerAudioList = ref([]); // Only populated for in-page Aplayer
const selectedSource = ref('kuwo');
const selectedBitrate = ref('128kmp3');
const playerRef = ref(null);

const MUSIC_PLAYER_WINDOW_STATE_KEY = 'musicPlayerWindowState';
const playMode = ref(localStorage.getItem('music_player_mode') || 'inpage');

watch(playMode, (newMode) => {
  localStorage.setItem('music_player_mode', newMode);
  // Clear aplayerAudioList if switching away from inpage mode
  if (newMode !== 'inpage') {
    aplayerAudioList.value = [];
  }
});

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

// handleSearchResults now just stores the raw results
const handleSearchResults = async (results) => {
  searchResults.value = results.map(song => ({ ...song, source: selectedSource.value }));
  console.log('Search Results in Auth (Raw):', searchResults.value);

  // No need to eagerly generate aplayerAudioList here anymore.
  // It will be generated on demand in playSongFromList.
  aplayerAudioList.value = []; // Ensure it's cleared when new search results arrive
};

const downloadSong = (song) => {
  window.location.href = `${API_BASE_URL}/download/${song.id}?source=${song.source}&br=${selectedBitrate.value}`;
};

// Helper function to fetch lyric for a given song
const fetchLyric = async (songId, source) => {
  try {
    const lyricResponse = await fetch(`${API_BASE_URL}/lyric/${songId}?source=${source}`, { credentials: 'include' });
    const lyricData = await lyricResponse.json();
    return lyricData.lrc || '';
  } catch (error) {
    console.error(`Error fetching lyric for song ID ${songId}:`, error);
    return '';
  }
};

// Core logic: determine playback method and prepare list
const playSongFromList = async (index) => {
  if (!searchResults.value || searchResults.value.length === 0) {
    console.warn('No songs available to play. Please search for songs first.');
    return;
  }

  // Common data preparation logic for both playback modes
  const currentSong = searchResults.value[index];

  if (playMode.value === 'inpage') {
    console.log('Parent component received playback request (In-page Aplayer), index:', index);

    // Prepare Aplayer-specific list
    const newAplayerAudioList = await Promise.all(searchResults.value.map(async (song, i) => {
      // Prioritize existing lrcString, otherwise fetch
      const lrcContent = song.lrcString || (await fetchLyric(song.id, song.source));
      return {
        name: song.title || song.name, // Use title, fallback to name
        artist: song.artist,
        url: `${API_BASE_URL}/download/${song.id}?source=${song.source}&br=${selectedBitrate.value}`,
        cover: song.coverUrl || song.cover_url, // Use coverUrl, fallback to cover_url
        lrc: lrcContent,
        index: i,
      };
    })).then(list => list.filter(item => item !== null));

    aplayerAudioList.value = newAplayerAudioList; // Update aplayerAudioList

    // Wait for next tick to ensure Aplayer component updates
    await new Promise(resolve => setTimeout(resolve, 0)); // Short delay for reactivity

    if (playerRef.value && playerRef.value.aplayerInstance) {
      playerRef.value.aplayerInstance.list.switch(index);
      playerRef.value.aplayerInstance.play();
    } else {
      console.warn('Aplayer instance not ready. This might happen if the component is just mounted.');
      // If Aplayer is not yet ready, give it a bit more time or re-evaluate component lifecycle.
    }
  } else { // External Player Mode
    console.log('Parent component received playback request (External Player), index:', index);

    // Prepare external player specific list
    const externalPlayerPlaylist = await Promise.all(searchResults.value.map(async (song) => {
      // Prioritize existing lrcString, otherwise fetch
      const lrcContent = song.lrcString || (await fetchLyric(song.id, song.source));
      return {
        id: song.id,
        title: song.title || song.name, // Use title, fallback to name
        artist: song.artist,
        album: song.album,
        coverUrl: song.coverUrl || song.cover_url,
        audioUrl: `${API_BASE_URL}/download/${song.id}?source=${song.source}&br=${selectedBitrate.value}`,
        lrcString: lrcContent,
      };
    })).then(list => list.filter(item => item !== null));

    sendToMusicPlayer(externalPlayerPlaylist, index);
  }
};

// sendToMusicPlayer function - kept within Auth.vue for now, but consider moving to a utility file
function sendToMusicPlayer(playlist, currentSongIndex) {
    try {
        // 传递播放列表和当前歌曲索引
        localStorage.setItem('musicPlayer_playlist', JSON.stringify(playlist));
        localStorage.setItem('musicPlayer_currentSongIndex', String(currentSongIndex));

        const musicPlayerUrl = '/'; // 你的外部播放器实际 URL
        let playerWindow = null;

        // 检查 localStorage 中是否有窗口状态，尝试激活现有窗口
        if (localStorage.getItem(MUSIC_PLAYER_WINDOW_STATE_KEY) === 'true') {
            console.log('尝试激活现有播放器窗口...');
            playerWindow = window.open('javascript:;', 'musicPlayerWindow');
            if (playerWindow) {
                playerWindow.focus();
            } else {
                console.warn('未能激活现有窗口，可能是被浏览器阻止了弹出窗口。将尝试重新打开。');
                // 如果激活失败（例如被阻止），尝试重新打开
                playerWindow = window.open(musicPlayerUrl, 'musicPlayerWindow');
                if (playerWindow) {
                    playerWindow.focus();
                    localStorage.setItem(MUSIC_PLAYER_WINDOW_STATE_KEY, 'true'); // 标记窗口已打开
                } else {
                    console.error('无法打开或激活音乐播放器窗口。');
                    alert('无法打开音乐播放器窗口。请检查浏览器设置或手动打开播放器页面。');
                }
            }
        } else {
            // 如果 localStorage 没有记录，或者记录为 false，则直接打开新窗口
            console.log('直接打开新播放器窗口...');
            playerWindow = window.open(musicPlayerUrl, 'musicPlayerWindow');
            if (playerWindow) {
                playerWindow.focus();
                // 设置窗口状态为已打开
                localStorage.setItem(MUSIC_PLAYER_WINDOW_STATE_KEY, 'true');
            } else {
                console.warn('未能打开音乐播放器窗口。可能是被浏览器阻止了弹出窗口。');
                alert('无法打开音乐播放器窗口。请检查浏览器设置或手动打开播放器页面。');
            }
        }

    } catch (error) {
        console.error('发送数据到音乐播放器时发生错误:', error);
        alert('无法连接到音乐播放器。请检查网络或手动打开播放器页面。');
    }
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const passwordFromUrl = urlParams.get('pwd');

  if (passwordFromUrl) {
    authenticate(passwordFromUrl);
  } else {
    const token = getCookie('token');
    if (token) {
      authenticate();
    }
  }
});
</script>

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

    <div style="margin-top: 20px;">
      <label>播放模式:</label>
      <input type="radio" id="playModeInpage" value="inpage" v-model="playMode">
      <label for="playModeInpage">页内播放</label>
      <input type="radio" id="playModeExternal" value="external" v-model="playMode">
      <label for="playModeExternal">独立播放器播放</label>
    </div>

    <Search :source="selectedSource" @search-results="handleSearchResults" style="width: 80%; max-width: 960px; margin: 20px auto 0;" />
    <div class="player-list-container" style="width: 80%; max-width: 960px; margin: 20px auto 0;">
      <SongList :songs="searchResults" @download="downloadSong" @play-song-from-list="playSongFromList" class="song-list-item" />
      <Player :audioList="aplayerAudioList" v-if="aplayerAudioList.length > 0 && playMode === 'inpage'" ref="playerRef" class="player-item" />
    </div>
    <Footer style="margin-top: 40px;" />
  </div>
</template>
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