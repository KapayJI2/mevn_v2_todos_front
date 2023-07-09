<template>
  <el-container>
    <el-main
      v-loading.fullscreen.lock="isLoading"
      element-loading-text="Загрузка..."
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-row justify="start" v-if="!isLoading">
        <el-col :span="24">
          <el-descriptions
            title="Информация пользователя"
            border
            :column="3"
            direction="vertical"
          >
            <el-descriptions-item label="Имя">{{
              getUser.user.firstName
            }}</el-descriptions-item>
            <el-descriptions-item label="Фамилия">{{
              getUser.user.lastName
            }}</el-descriptions-item>
            <el-descriptions-item label="Email">{{
              getUser.user.email
            }}</el-descriptions-item>
            <el-descriptions-item label="Возраст">{{
              getUser.user.age
            }}</el-descriptions-item>
            <el-descriptions-item label="Пол">{{
              getUser.user.gender ? getUser.user.gender : "Не указан"
            }}</el-descriptions-item>
            <el-descriptions-item label="Телефон">{{
              getUser.user.phone
            }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-main>
    <el-footer></el-footer>
    <span>Вы можете изменить информацию о себе в личном разделе</span>
  </el-container>
</template>
<script>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { delLocalStorage, getLocalStorage } from "@/utils/localStorage/index";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const isLoading = ref(true);
    const API_USER_LINK = ref(process.env.VUE_APP_BASE_API_URL + "/api/user/");
    onMounted(async () => {
      await fetch(
        `${process.env.VUE_APP_BASE_API_URL}/api/user/${store.getters.getUser.user._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.getters.getUser.token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => store.dispatch("setUserData", data));
      isLoading.value = false;
    });
    const getUser = computed(() => {
      return store.getters.getUser;
    });
    return {
      getUser,
      isLoading,
      // getUserApi,
    };
  },
};
</script>
