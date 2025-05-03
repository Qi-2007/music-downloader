<template>
  <div class="footer">
    <div class="links">
      <h3>友情链接</h3>
      <ul>
        <li><a href="https://music.gdstudio.xyz/" target="_blank" rel="noopener noreferrer">GD音乐台</a></li>
        <li><a href="https://github.com/Binaryify/NeteaseCloudMusicApi" target="_blank" rel="noopener noreferrer">NeteaseCloudMusicApi</a></li>
        <li><a href="https://git.unlock-music.dev/um/um-react" target="_blank" rel="noopener noreferrer">unlock-music</a></li>
        <li><a href="https://aplayer.js.org/" target="_blank" rel="noopener noreferrer">Aplayer</a></li>
        
      </ul>
    </div>
    <div class="copyright">
      <p>如果本项目对你有帮助，请给我一个star：<a href="https://github.com/Qi-2007/music-downloader" target="_blank" rel="noopener noreferrer">项目地址</a></p>
      <p>&copy; {{ currentYear }} Qi. All Rights Reserved.</p>
    </div>
    <div class="disclaimer">
      <h3>免责声明</h3>
      <p>本网站提供的所有内容仅供学习交流使用，不保证其准确性、完整性和合法性。用户因使用本网站内容而产生的任何后果，本网站概不负责。如有侵权，请联系我们删除。</p>
      <p>本网站未在中国大陆地区备案，不保证其在中国大陆地区的合法性，不对中国大陆地区用户提供服务，请中国大陆地区的用户立即关闭本网站</p>
      </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.footer {
  padding: 20px;
  text-align: center;
  margin-top: 40px; /* 可根据需要调整上边距 */
}

.links {
  margin-bottom: 15px;
}

.links h3 {
  font-size: 1.2em;
  margin-bottom: 5px;
}

.links ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap; /* 添加这一行，允许子元素在空间不足时换行 */
}

.links ul li a {
  text-decoration: none;
}

.copyright {
  font-size: 0.9em;
  margin-bottom: 10px;
}

.disclaimer {
  font-size: 0.8em;
}

.disclaimer h3 {
  font-size: 1em;
  margin-bottom: 5px;
}

.disclaimer p {
  line-height: 1.5;
}
</style>