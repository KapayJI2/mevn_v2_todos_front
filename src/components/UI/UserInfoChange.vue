<template>
  <div>
    <el-container
      v-loading.fullscreen.lock="isLoading"
      element-loading-text="Загрузка..."
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-main>
        <el-row justify="center">
          <el-col :span="24">
            <el-form
              label-width="120px"
              label-position="right"
              ref="ruleForm"
              :model="form"
              :rules="rules"
              status-icon
              v-if="!isLoading"
              hide-required-asterisk
            >
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="Имя" prop="firstName"
                    ><el-input v-model="form.firstName"></el-input
                  ></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Фамилия" prop="lastName"
                    ><el-input v-model="form.lastName"></el-input
                  ></el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="Email" prop="email"
                    ><el-input v-model="form.email"></el-input
                  ></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Телефон" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="Возраст" prop="age">
                    <el-input-number
                      v-model="form.age"
                      :min="1"
                      :max="100"
                      controls-position="right"
                  /></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Пол" prop="gender">
                    <el-select v-model="form.gender" placeholder="Пол">
                      <el-option label="Мужской" value="male"></el-option>
                      <el-option
                        label="Женский"
                        value="female"
                      ></el-option> </el-select
                  ></el-form-item> </el-col
              ></el-row>
              <el-row :gutter="10" align="middle">
                <el-col :span="24">
                  <el-form-item>
                    <el-button round @click="handleCancelClick"
                      >Назад</el-button
                    >
                    <el-button type="primary" round @click="validateForm"
                      >Сохранить изменения</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { computed, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  checkFirstName,
  checkLastName,
  checkEmail,
  checkPhone,
} from "../../utils/validation/index.js";
import { ElMessage } from "element-plus";
export default {
  setup(props) {
    const API_USER_CHANGE_LINK = ref(process.env.VUE_APP_BASE_API_URL + "/api/user/");
    const responseBack = ref("");
    const router = useRouter();
    const store = useStore();
    const isLoading = ref(false);
    const handleUser = computed(() => {
      return store.getters.getUser;
    });
    const ruleForm = ref("ruleForm");
    const form = reactive({
      firstName: store.getters.getUser.user.firstName,
      lastName: store.getters.getUser.user.lastName,
      email: store.getters.getUser.user.email,
      age: store.getters.getUser.user.age,
      gender: store.getters.getUser.user.gender,
      phone: store.getters.getUser.user.phone,
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
      router.push({
        path: `/user/${store.getters.getUser.user._id}`,
      });
    };
    const validateForm = () => {
      ruleForm.value.validate(async (valid) => {
        isLoading.value = true;
        if (valid) {
          try {
            const updatingData = {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${store.getters.getUser.token}`,
              },
              body: JSON.stringify(form),
            };
            const response = await fetch(
              API_USER_CHANGE_LINK.value +
                store.getters.getUser.user._id +
                "/change-info",
              updatingData
            );
            const data = await response.json();
            responseBack.value = data.message;
            if (response.ok) {
              successRegistration(responseBack.value);
              isLoading.value = false;
              router.push({
                path: `/user/${store.getters.getUser.user._id}`,
              });
            } else {
              unsuccessRegistration(responseBack.value);
              isLoading.value = false;
            }
          } catch (e) {
            unsuccessRegistration(
              "Нет соединения с сервером, попробуйте позже"
            );
            isLoading.value = false;
          }
        } else {
          return false;
        }
        isLoading.value = false;
      });
    };
    return {
      form,
      ruleForm,
      rules,
      validateForm,
      handleCancelClick,
      isLoading,
      handleUser,
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
