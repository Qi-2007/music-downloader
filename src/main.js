// main.js (或 main.ts)
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

let API_BASE_URL = '/api'; // 你的 API 域名
if (process.env.NODE_ENV === 'development') {
    API_BASE_URL = 'http://localhost:3001/api'; // 你的 API 域名
    console.log('这是开发环境');
}
const app = createApp(App);
app.provide('API_BASE_URL', API_BASE_URL);
app.mount('#app');