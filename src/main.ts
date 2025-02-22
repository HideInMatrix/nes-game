import { createApp } from "vue";
import "@unocss/reset/tailwind.css";
import "uno.css";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router/index"; // 导入你的 router 配置文件
import VueGtag from "vue-gtag";

const app = createApp(App);
app.use(i18n);
app.use(router);
app.use(VueGtag, {
  config: { id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID },
});
app.mount("#app");
