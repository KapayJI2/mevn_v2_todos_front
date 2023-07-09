<template>
  <div>
    <el-container
      v-loading.fullscreen.lock="isLoading"
      element-loading-text="Загрузка..."
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-main>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-table :data="getTodos" style="width: 100%" row-click>
              <el-table-column label="Title" prop="title" />
              <el-table-column label="Content" prop="content" />
              <el-table-column align="right">
                <template #header>
                  <el-input size="mini" placeholder="Type to search" />
                </template>
                <template #default="scope">
                  <!-- <el-button size="mini" @click="editTodo(scope.row)"
                    >Edit</el-button
                  > -->
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteTodo(scope.row)"
                    >Delete</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog
      v-model="editTodoDialogVisible"
      title="Update todo"
      width="30%"
      destroy-on-close
      center
    >
      <span>Title<el-input v-model="editableTodo.value.title"/></span>
      <span
        >Content<el-input
          v-model="editableTodo.value.content"
          :rows="2"
          type="textarea"
      /></span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editTodoDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmedEdit">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
    <el-affix position="bottom" :offset="20">
      <el-button
        type="primary"
        icon="el-icon-plus"
        circle
        @click="createTodoDialogVisible = true"
      ></el-button>
    </el-affix>
    <el-dialog
      v-model="createTodoDialogVisible"
      title="Create todo"
      width="30%"
      destroy-on-close
      center
    >
      <span>Title<el-input v-model="newTodo.title"/></span>
      <span
        >Content<el-input v-model="newTodo.content" :rows="2" type="textarea"
      /></span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createTodoDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmedCreate">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { computed, onMounted, reactive, ref } from "vue-demi";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const isLoading = ref(true);
    const newTodo = ref({
      title: "",
      content: "",
    });
    const editableTodo = reactive({
      _id: "",
      title: "",
      content: "",
    });
    const editTodoDialogVisible = ref(false);
    const createTodoDialogVisible = ref(false);
    const API_TODO_LINK = ref(process.env.VUE_APP_BASE_API_URL + "/api/todo");
    onMounted(async () => {
      await fetch(API_TODO_LINK.value, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.getters.getUser.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => store.dispatch("setTodos", data));
      isLoading.value = false;
    });
    const updateTodoList = async () => {
      isLoading.value = true;
      await fetch(API_TODO_LINK.value, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.getters.getUser.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => store.dispatch("setTodos", data));
      isLoading.value = false;
    };
    const editTodo = (value) => {
      editTodoDialogVisible.value = true;
      editableTodo.value = {
        _id: value._id,
        title: value.title,
        content: value.content,
      };
      console.log(editableTodo.value);
    };
    const confirmedEdit = async () => {
      await fetch(
        API_TODO_LINK.value + "/" + editableTodo.value._id + "/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.getters.getUser.token}`,
          },
          body: JSON.stringify(editableTodo.value),
        }
      );
      editTodoDialogVisible.value = false;
      editableTodo.value = {
        _id: "",
        title: "",
        content: "",
      };
      updateTodoList();
    };
    const confirmedCreate = async () => {
      await fetch(API_TODO_LINK.value + "/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.getters.getUser.token}`,
        },
        body: JSON.stringify(newTodo.value),
      });
      createTodoDialogVisible.value = false;
      newTodo.value = { title: "", content: "" };
      updateTodoList();
    };
    const deleteTodo = async (value) => {
      await fetch(API_TODO_LINK.value + "/" + value._id + "/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.getters.getUser.token}`,
        },
        body: JSON.stringify({ _id: value._id }),
      });
      updateTodoList();
    };
    const getTodos = computed(() => {
      return store.getters.getTodos;
    });
    return {
      getTodos,
      isLoading,
      editTodoDialogVisible,
      createTodoDialogVisible,
      editTodo,
      confirmedEdit,
      editableTodo,
      confirmedCreate,
      deleteTodo,
      newTodo,
    };
  },
};
</script>
