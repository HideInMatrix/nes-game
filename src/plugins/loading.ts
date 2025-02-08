import Loading from "@/components/Loading.vue";
import type { ComponentPublicInstance } from "vue";

interface LoadingInstance extends ComponentPublicInstance {
  open: (message?: string) => void;
  close: () => void;
}

let loadingInstance: LoadingInstance | null = null;

const LoadingService = {
  open(message = "加载中") {
    if (!loadingInstance) {
      const loadingApp = createApp(Loading);
      const mountNode = document.createElement("div");
      document.body.appendChild(mountNode);
      loadingInstance = loadingApp.mount(mountNode) as LoadingInstance;
    }
    loadingInstance.open(message);
  },
  close() {
    if (loadingInstance) {
      loadingInstance.close();
    }
  },
};

export default LoadingService;
