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
    <div> <label for="bitrate">选择音质:</label> <select id="bitrate" v-model="selectedBitrate" @change="() => console.log('Selected Bitrate:', selectedBitrate)"> <option value="128kmp3">128kbps MP3</option> <option value="320kmp3">320kbps MP3</option> <option value="2000kflac">2000kbps FLAC</option> </select> </div>
    <Search :source="selectedSource" @search-results="handleSearchResults" style="width: 80%; max-width: 960px; margin: 20px auto 0;" />
    <SongList :songs="searchResults" @download="downloadSong" style="width: 80%; max-width: 960px; margin: 20px auto 0;" />
    <Player :audioList="aplayerAudioList" v-if="aplayerAudioList.length > 0" style="width: 80%; max-width: 960px; margin: 20px auto 0;" />
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
const selectedSource = ref('kuwo'); // 默认选择网易云音乐
const selectedBitrate = ref('128kmp3'); // 默认选择 128kbps

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
      password.value = ''; // 登录成功后清空密码输入框
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
  aplayerAudioList.value = await Promise.all(results.map(async (song) => {
    try {
      const lyricResponse = await fetch(`${API_BASE_URL}/lyric/${song.id}?source=${selectedSource.value}`, { credentials: 'include' });
      const lyricData = await lyricResponse.json();
      return {
        name: song.name,
        artist: song.artist,
        url: `${API_BASE_URL}/download/${song.id}?source=${selectedSource.value}&br=${selectedBitrate.value}`, // 使用 download 接口
        cover: song.cover_url,
        lrc: lyricData.lrc || '',
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

onMounted(() => {
  const token = getCookie('token');
  if (token) {
    console.log('Found token in cookie, attempting auto login.');
    authenticate(); // 不传递密码，依赖 Cookie 中的 token
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
</style>