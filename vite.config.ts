import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import AutoComplete from "unplugin-auto-import/vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

const pathSrc = resolve(__dirname, "src");
export default defineConfig({
  base: "/" /* 这个就是webpack里面的publicPath */,

  build: {
    outDir: "dist", // 输出目录
    rollupOptions: {
      output: {
        // 最小化拆分包
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        }, // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
        entryFileNames: "js/[name].[hash].js", // 用于命名代码拆分时创建的共享块的输出命名
        chunkFileNames: "js/[name].[hash].js", // 用于输出静态资源的命名，[ext]表示文件扩展名
        // assetFileNames: '[ext]/[name].[hash].[ext]', // 拆分js到模块文件夹 // chunkFileNames: (chunkInfo) => { //     const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : []; //     const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]'; //     return `js/${fileName}/[name].[hash].js`; // },
      },
    },
  },
  resolve: {
    alias: {
      "@/": `${pathSrc}/`,
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://game-api.micromatrix.org/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [
    vue(),
    UnoCSS(),
    AutoComplete({
      imports: ["vue", "vue-router"],
      dts: resolve(pathSrc, "auto-imports.d.ts"),
    }),
    VitePWA({
      mode: process.env ? "development" : "production",
      base: "/",
      registerType: "autoUpdate",
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /.*/, // 接口缓存 此处填你想缓存的接口正则匹配
            handler: "CacheFirst",
            options: {
              cacheName: "interface-cache",
            },
          },
          {
            urlPattern: /(.*?)\.(js|css|ts)/, // js /css /ts静态资源缓存
            handler: "CacheFirst",
            options: {
              cacheName: "js-css-cache",
            },
          },
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
            },
          },
          {
            urlPattern: /\/api\/roms\/getFile/,
            handler: "CacheFirst", // 使用缓存优先策略
            options: {
              cacheName: "api-cache", // 缓存名称
              expiration: {
                maxEntries: 10, // 最多缓存10个请求
                maxAgeSeconds: 60 * 60 * 24, // 缓存1天
              },
            },
          },
        ],
      },
      manifest: {
        name: "游戏门户网站",
        short_name: "GamePortal",
        description: "红白机模拟器网站",
        start_url: "index.html",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "320x320",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
