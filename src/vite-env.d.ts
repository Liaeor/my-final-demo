// 告诉 TS 编译器引入 vite/client.d.ts 中的所有类型
/// <reference types="vite/client" />
// 全局类型声明 ，会自动在已声明的类型里合并
interface ImportMetaEnv {
  readonly VITE_API_PRE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
