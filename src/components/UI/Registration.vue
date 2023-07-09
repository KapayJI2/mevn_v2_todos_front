<template>
  <div>
    <el-container
      v-loading.fullscreen.lock="isLoading"
      element-loading-text="Загрузка..."
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-row justify="center">
        <el-col :span="14">
          <el-main class="form__wrapper">
            <el-form
              label-width="120px"
              label-position="right"
              ref="ruleForm"
              :model="form"
              :rules="rules"
              status-icon
              v-if="!isLoading"
            >
              <el-form-item label="Имя" prop="firstName"
                ><el-input
                  v-model="form.firstName"
                  placeholder="Жора"
                ></el-input
              ></el-form-item>
              <el-form-item label="Фамилия" prop="lastName"
                ><el-input
                  v-model="form.lastName"
                  placeholder="Тулупкин"
                ></el-input
              ></el-form-item>
              <el-form-item label="Email" prop="email"
                ><el-input v-model="form.email"></el-input
              ></el-form-item>
              <el-form-item label="Возраст" prop="age" v-if="!hiddenFields">
                <el-col :span="5">
                  <el-input-number
                    v-model="form.age"
                    :min="1"
                    :max="100"
                    controls-position="right"/></el-col
              ></el-form-item>
              <el-form-item label="Пол" prop="gender" v-if="!hiddenFields">
                <el-col :span="5">
                  <el-select v-model="form.gender" placeholder="Пол">
                    <el-option label="Мужской" value="male"></el-option>
                    <el-option
                      label="Женский"
                      value="female"
                    ></el-option> </el-select></el-col
              ></el-form-item>
              <el-form-item label="Телефон" prop="phone">
                <el-input v-model="form.phone"></el-input>
              </el-form-item>
              <el-form-item label="Пароль" prop="password">
                <el-input
                  v-model="form.password"
                  auto-complete="new password"
                  type="password"
                ></el-input>
              </el-form-item>
              <el-form-item label="Подтверждение" prop="confirmPassword">
                <el-input
                  v-model="form.confirmPassword"
                  type="password"
                ></el-input>
              </el-form-item>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="">
                    <span>Скрыть необязательные поля</span>
                    <el-switch v-model="hiddenFields" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                    <el-button @click="handleCancelClick">Назад</el-button>
                    <el-button type="warning" @click="resetForm"
                      >Сбросить</el-button
                    >
                    <el-button type="primary" @click="validateForm"
                      >Зарегистрироваться</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-main>
        </el-col>
      </el-row>
      <el-footer
        ><el-link type="warning" @click="handleLoginClick">
          Уже есть аккаунт?
        </el-link></el-footer
      >
    </el-container>
  </div>
</template>
<script>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  checkFirstName,
  checkLastName,
  checkEmail,
  checkPassword,
  checkPhone,
} from "../../utils/validation/index.js";
import { ElMessage } from "element-plus";
export default {
  setup(props) {
    const API_AUTH_LINK = ref(process.env.VUE_APP_BASE_API_URL + "/api/auth");
    const responseBack = ref("");
    const router = useRouter();
    const hiddenFields = ref(false);
    const isLoading = ref(false);
    const handleLoginClick = () => {
      router.push({ name: "login" });
    };
    const confirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("Заполните поле"));
      }
      if (value !== form.password) {
        callback(new Error("Пароли должны совпадать"));
      }
      callback();
    };
    const ruleForm = ref("ruleForm");
    const form = reactive({
      firstName: "",
      lastName: "",
      email: "",
      age: 18,
      gender: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    const rules = ref({
      firstName: [
        {
          required: true,
          validator: checkFirstName,
          trigger: "blur",
        },
      ],
      lastName: [
        {
          required: true,
          validator: checkLastName,
          trigger: "blur",
        },
      ],
      email: [
        {
          required: true,
          validator: checkEmail,
          trigger: "blur",
        },
      ],
      // age: [
      //   {
      //     required: true,
      //     message: "Введите возраст",
      //     trigger: "blur",
      //   },
      // ],
      // gender: [{ required: true, message: "Выберите пол", trigger: "blur" }],
      phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
      password: [
        {
          required: true,
          validator: checkPassword,
          trigger: "blur",
        },
      ],
      confirmPassword: [
        {
          required: true,
          validator: confirmPassword,
          trigger: "blur",
        },
      ],
    });
    const successRegistration = (message) => {
      ElMessage({
        showClose: true,
        message,
        type: "success",
      });
    };
    const unsuccessRegistration = (message) => {
      ElMessage({
        showClose: true,
        message,
        type: "error",
      });
    };
    const handleCancelClick = () => {
      router.push({ name: "home" });
    };
    const validateForm = () => {
      ruleForm.value.validate(async (valid) => {
        isLoading.value = true;
        if (valid) {
          try {
            const registrationData = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(form),
            };
            const response = await fetch(
              API_AUTH_LINK.value + "/registration",
              registrationData
            );
            const data = await response.json();
            responseBack.value = data.message;
            if (response.ok) {
              successRegistration(responseBack.value);
              router.push({ name: "login" });
            } else {
              unsuccessRegistration(responseBack.value);
            }
          } catch (e) {
            unsuccessRegistration(
              "Нет соединения с сервером, попробуйте позже"
            );
          }
        } else {
          return false;
        }
        isLoading.value = false;
      });
    };
    const resetForm = () => {
      ruleForm.value.resetFields();
    };
    return {
      handleLoginClick,
      form,
      ruleForm,
      rules,
      validateForm,
      resetForm,
      handleCancelClick,
      hiddenFields,
      isLoading,
    };
  },
};
</script>
<style>
.form__wrapper {
  box-shadow: 1px 1px 5px rgba(128, 128, 128, 0.514);
  border-radius: 10px;
}
</style>
