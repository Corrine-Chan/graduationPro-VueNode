/// <reference types="vite/client" />
declare module "mockjs"
// 如果报错,因为TypeScript 并不知道如何理解 `.vue` 文件，因此需要这样一个声明
declare module '*.vue' {
    import { ComponentOptions } from 'vue'
    const componentOptions: ComponentOptions
    export default componentOptions
  }