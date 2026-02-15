import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'pages/login.html'),
        feed: resolve(__dirname, 'pages/feed.html'),
        createFact: resolve(__dirname, 'pages/createFact.html'),
        profile: resolve(__dirname, 'pages/profile.html'),
        quiz: resolve(__dirname, 'pages/quiz.html'),
        ranking: resolve(__dirname, 'pages/ranking.html'),
      },
    },
  },
});