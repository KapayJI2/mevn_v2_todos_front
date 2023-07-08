<template>
  <div>
    <Modal
      :title="'Авторизация'"
      @onClose="handleModalClose"
      v-if="isModalShow"
    >
      <Login />
    </Modal>
  </div>
</template>
<script>
import Modal from "@/components/UI/Modal";
import Login from "@/components/UI/Login";
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  components: { Modal, Login },
  setup() {
    const router = useRouter();
    const isModalShow = ref(true);
    const handleModalClose = () => {
      isModalShow.value = false;
      router.push({ name: "home" });
    };
    return {
      isModalShow,
      handleModalClose,
    };
  },
};
</script>
