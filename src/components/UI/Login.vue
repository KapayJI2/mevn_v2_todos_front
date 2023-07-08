<template>
  <div>
    <el-container>
      <el-row justify="center">
        <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="12">
          <el-main class="form__wrapper">
            <el-form
              label-width="120px"
              label-position="right"
              ref="loginForm"
              :model="form"
              :rules="rules"
              status-icon
              hide-required-asterisk
            >
              <el-form-item label="Email" prop="email">
                <el-input v-model="form.email" type="email"></el-input>
              </el-form-item>
              <el-form-item label="Пароль" prop="password">
                <el-input v-model="form.password" type="password"> </el-input>
              </el-form-item>
              <el-row justify="center">
                <el-col :span="24">
                  <el-form-item>
                    <el-button @click="handleCancelClick">Назад</el-button>
                    <el-button type="primary" @click="handleLogin"
                      >Войти</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-main>
        </el-col>
      </el-row>
      <el-footer
        ><el-link type="warning" @click="handleRegistrationClick">
          Ещё не зарегистрировались?
        </el-link></el-footer
      >
    </el-container>
  </div>
</template>
<script>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
export default {
  emits: ["onUserLogin"],
  setup(_, { emit }) {
    const router = useRouter();
    const store = useStore();
    const API_LINK_LOGIN = ref(process.env.VUE_APP_BASE_URL + "/api/auth");
    const responseBack = ref("");
    const handleRegistrationClick = () => {
      router.push({ name: "registration" });
    };
    const form = reactive({
      email: "",
      password: "",
    });
    const loginForm = ref("loginForm");
    const rules = ref({
      email: [
        {
          required: true,
          message: "Поле должно быть заполнено",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "Поле должно быть заполнено",
          trigger: "blur",
        },
      ],
    });
    const successLoginMessage = (message) => {
      ElMessage({
        showClose: true,
        message,
        type: "success",
      });
    };
    const unsuccessLoginMessage = (message) => {
      ElMessage({
        showClose: true,
        message,
        type: "error",
      });
    };
    const handleLogin = () => {
      loginForm.value.validate(async (valid) => {
        if (valid) {
          try {
            const loginData = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(form),
            };
            const response = await fetch(
              API_LINK_LOGIN.value + "/login",
              loginData
            );
            const data = await response.json();
            responseBack.value = data.message;
            if (response.ok) {
              if (data.token && data.userId) {
                store.dispatch("setUser", ["KapayJI-login-system", data]);
                successLoginMessage(responseBack.value);
                emit("onUserLogin");
                router.push({
                  path: `/user/${store.getters.getUser.user._id}`,
                });
              }
            } else {
              unsuccessLoginMessage(responseBack.value);
            }
          } catch (e) {
            unsuccessLoginMessage(
              "Нет соединения с сервером, попробуйте позже"
            );
          }
        } else {
          return false;
        }
      });
    };
    const handleCancelClick = () => {
      router.push({ name: "home" });
    };
    return {
      form,
      loginForm,
      rules,
      handleLogin,
      handleCancelClick,
      handleRegistrationClick,
    };
  },
};
</script>
<style></style>
