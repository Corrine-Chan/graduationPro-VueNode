import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 配置src为@必须配置的

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@':path.resolve(__dirname,"./src")  // 双下划线dirname能够获取当前文件夹的路径
    }
  }
})
