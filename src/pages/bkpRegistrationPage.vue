<template>
  <div>
    <Modal :title="'Регистрация'" @onClose="handleModalClose" v-if="isModalShow"
      ><Registration
    /></Modal>
  </div>
</template>
<script>
import Modal from "@/components/UI/Modal";
import Registration from "@/components/UI/Registration";
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  components: { Modal, Registration },
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
