// vite.config.js
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  base: '/music/', // 将 '/my-app/' 替换为你的实际子目录
  // 其他配置
});