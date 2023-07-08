import { createApp } from "vue";
// import Equal from "equal-vue";
import store from "./store/index.js";
import router from "./router.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./bootstrap.css";
import App from "./App.vue";

// import "equal-vue/dist/style.css";

createApp(App)
  //   .use(Equal)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .mount("#app");
