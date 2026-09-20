import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const proxyConfig: any = {};

  // 联调启用代理
  const isProxy = mode === "proxy";
  if (isProxy) {
    // 后端服务地址
    const target = "http://localhost:3001";
    
    proxyConfig["/api"] = {
      target, 
      changeOrigin: true,
      // 回调打印代理请求日志
      configure: (proxy: any) => {
        proxy.on("proxyReq", (proxyReq: unknown, req: { method: string; url: string }) => {
          console.log(
            `Proxy request: ${req.method} ${req.url} -> ${target}${req.url}`,
          );
        });
      },
    };
  }
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      open: true, // 启动后自动打开浏览器
      proxy: proxyConfig,
    },
  };
});
