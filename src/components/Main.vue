<template>
  <div>
    <div>
      Для начала работы Вам нужно
      <el-link type="primary" @click="handleRegistration"
        >зарегистрироваться</el-link
      >
      или
      <el-link type="primary" @click="handleAuthorization">войти</el-link>
    </div>
    <div></div>
  </div>
</template>
<script>
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const handleRegistration = () => {
      router.push({ name: "registration" });
    };
    const handleAuthorization = () => {
      router.push({ name: "login" });
    };
    return {
      handleRegistration,
      handleAuthorization,
    };
  },
};
</script>
