<template>
  <el-container>
    <el-header>
      <el-row :gutter="2">
        <el-col :span="24">
          <!-- <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-menu-item index="user" :disabled="!isUser">User</el-menu-item>
            <el-menu-item index="todos" :disabled="!isUser">Todo</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="2" v-if="isUser">
          <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            @select="openDrawler"
          >
            <el-menu-item index="user-info" align="right">
              <el-avatar size="medium"> user </el-avatar>
            </el-menu-item>
          </el-menu> -->
          <div class="navbar__wrapper">
            <ul class="navbar__list" :class="{ disabled: !isUser }">
              <li
                class="navbar__list-item"
                v-for="item in menuItems"
                :class="{
                  isSelected: isUser && item.id == activeIndex,
                  disabled: !isUser,
                }"
                :key="item.id"
                @click="handleSelect(item.name, item.id)"
              >
                {{ item.title }}
              </li>
            </ul>
            <ul class="navbar__profile">
              <li class="navbar__profile-item" v-if="isUser">
                <el-avatar
                  size="medium"
                  class="navbar__profile-item-avatar"
                  @click="openDrawler"
                >
                  user
                </el-avatar>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-divider></el-divider>
    <el-main><router-view @onUserLogin="handleUserLogin"/></el-main>
  </el-container>
  <el-drawer v-model="isOpenDrawler" direction="rtl" size="50%">
    <el-container>
      <el-header
        >Вы вошли как {{ handleUser.user.firstName }}
        {{ handleUser.user.lastName }}</el-header
      >
      <el-main>
        <div>
          <el-link type="primary" @click="handleInfoChange"
            >Изменить информацию о себе</el-link
          >
        </div>
      </el-main>
      <el-footer>
        <div><el-link type="primary" @click="handleLogout">Выход</el-link></div>
      </el-footer>
    </el-container>
  </el-drawer>
</template>
<script>
import UserInfoChange from "@/components/UI/UserInfoChange";
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { getLocalStorage, delLocalStorage } from "./utils/localStorage/index";
export default {
  components: { UserInfoChange },
  setup() {
    onMounted(async () => {
      if (getLocalStorage("KapayJI-login-system")) {
        store.dispatch("setUser", [
          "KapayJI-login-system",
          JSON.parse(getLocalStorage("KapayJI-login-system")),
        ]);
        try {
          const response = await fetch(
            `${process.env.VUE_APP_BASE_URL}/api/user/${store.getters.getUser.user._id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${store.getters.getUser.token}`,
              },
            }
          );
          if (response.ok) {
            isUser.value = true;
            router.push({ path: `/user/${store.getters.getUser.user._id}` });
          } else {
            isUser.value = false;
            delLocalStorage("KapayJI-login-system");
            router.push({ name: "home" });
          }
        } catch (e) {
          isUser.value = false;
          delLocalStorage("KapayJI-login-system");
          router.push({ name: "home" });
        }
      } else {
        isUser.value = false;
        delLocalStorage("KapayJI-login-system");
        router.push({ name: "home" });
      }
    });
    const menuItems = ref([
      { id: 1, name: "user", title: "User" },
      { id: 2, name: "todos", title: "Todo" },
    ]);

    const router = useRouter();
    const activeIndex = ref(1);
    const store = useStore();
    const isUser = ref(false);
    const isOpenDrawler = ref(false);
    const handleUserLogin = () => {
      isUser.value = true;
    };
    const openDrawler = () => {
      isOpenDrawler.value = !isOpenDrawler.value;
    };
    const handleUser = computed(() => {
      return store.getters.getUser;
    });
    const handleLogout = () => {
      isUser.value = false;
      isOpenDrawler.value = false;
      delLocalStorage("KapayJI-login-system");
      router.push({ name: "home" });
    };
    const handleInfoChange = () => {
      isOpenDrawler.value = false;
      router.push({ name: "user-info" });
    };
    const handleSelect = (key, index) => {
      isUser.value ? (activeIndex.value = index) : (activeIndex.value = 1);
      isUser.value
        ? key != "user"
          ? router.push({ name: `${key}` })
          : router.push({ path: `/${key}/${store.getters.getUser.user._id}` })
        : router.push({ name: "home" });
    };
    return {
      menuItems,
      activeIndex,
      handleSelect,
      isUser,
      handleUser,
      isOpenDrawler,
      openDrawler,
      handleLogout,
      handleUserLogin,
      handleInfoChange,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

.navbar__wrapper {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
}
.navbar__list,
.navbar__profile {
  margin: 0;
  padding: 0;
  display: flex;
  list-style: none;
  justify-content: space-between;
  align-items: center;
}
.navbar__list-item,
.navbar__profile-item {
  margin: 25px 25px auto 25px;
  cursor: pointer;
}
.disabled {
  color: rgba(128, 128, 128, 0.281);
  cursor: not-allowed;
}
.isSelected {
  color: #409eff;
  text-decoration: underline;
}
</style>
