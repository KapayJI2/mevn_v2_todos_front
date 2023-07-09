<template>
  <div>
    <el-container
      v-loading.fullscreen.lock="isLoading"
      element-loading-text="Загрузка..."
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-main v-if="!isLoading">
        <el-row :gutter="2" justify="center" class="todo__search-wrapper">
          <el-col :span="8">
            <el-input v-model="input" placeholder="Please input" />
          </el-col>
          <el-col :span="1">
            <el-button type="primary" @click="searchTodo">Search</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div v-for="item in getTodos" :key="item._id" class="todo_wrapper">
              <span @click="editTodo(item)" class="todo_item-title">{{
                item.title
              }}</span>
              <el-divider class="todo__divider"></el-divider>
              <div class="content_block">
                <div @click="editTodo(item)" class="todo_item-content">
                  {{ item.content }}
                </div>
                <div>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="deleteTodo(item._id)"
                  ></el-button>
                </div>
              </div>
            </div>
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
      <span
        >Title<el-input v-model="editableTodo.value.title" maxlength="30"
      /></span>
      <span
        >Content<el-input
          v-model="editableTodo.value.content"
          :rows="2"
          type="textarea"
          autosize
      /></span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editTodoDialogVisible = false">Cancel</el-button>

          <el-button type="primary" @click="confirmedEdit">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
    <el-affix position="bottom" :offset="20" v-if="!isLoading">
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
      <span>Title<el-input v-model="newTodo.title" maxlength="30"/></span>
      <span
        >Content<el-input
          v-model="newTodo.content"
          :rows="2"
          type="textarea"
          autosize
      /></span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createTodoDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmedCreate">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="deleteTodoDialogVisible"
      title="Delete todo"
      width="30%"
      destroy-on-close
      center
    >
      <div>
        <span>Вы действительно хотите удалить туду?</span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteTodoDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmedDelete">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { computed, onMounted, reactive, ref } from "vue-demi";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
export default {
  setup() {
    const store = useStore();
    const input = ref("");
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
    const deletableTodo = ref("");
    const editTodoDialogVisible = ref(false);
    const deleteTodoDialogVisible = ref(false);
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
      if (editableTodo.value.title && editableTodo.value.content) {
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
      } else {
        ElMessage({
          showClose: true,
          message: "Все поля должны быть заполнены",
          type: "error",
        });
      }
    };
    const confirmedCreate = async () => {
      if (newTodo.value.title && newTodo.value.content) {
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
      } else {
        ElMessage({
          showClose: true,
          message: "Все поля должны быть заполнены",
          type: "error",
        });
      }
    };
    const deleteTodo = (value) => {
      deleteTodoDialogVisible.value = true;
      deletableTodo.value = value;
    };
    const confirmedDelete = async () => {
      await fetch(API_TODO_LINK.value + "/" + deletableTodo.value + "/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.getters.getUser.token}`,
        },
        body: JSON.stringify({ _id: deletableTodo.value }),
      });
      deleteTodoDialogVisible.value = false;
      deletableTodo.value = "";
      updateTodoList();
    };
    const searchTodo = async () => {
      if (input.value) {
        isLoading.value = true;
        await fetch(API_TODO_LINK.value + "/search/" + input.value, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${store.getters.getUser.token}`,
          },
        })
          .then((response) => response.json())
          .then((data) =>
            data.length > 0
              ? store.dispatch("setTodos", data)
              : (store.dispatch("setTodos", data),
                ElMessage({
                  showClose: true,
                  message: "Ничего не найдено",
                  type: "error",
                }))
          );
        input.value = "";
        isLoading.value = false;
      } else {
        updateTodoList();
      }
    };
    const getTodos = computed(() => {
      return store.getters.getTodos;
    });
    return {
      getTodos,
      isLoading,
      editTodoDialogVisible,
      deleteTodoDialogVisible,
      createTodoDialogVisible,
      editTodo,
      confirmedEdit,
      editableTodo,
      confirmedCreate,
      confirmedDelete,
      newTodo,
      deleteTodo,
      getTodos,
      input,
      searchTodo,
    };
  },
};
</script>
<style>
.todo_wrapper {
  border: none;
  box-shadow: 1px 1px 3px gray;
  border-radius: 10px;
  margin-bottom: 5px;
  text-align: left;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.233);
}
.content_block {
  display: flex;
  justify-content: space-between;
}
.todo__search-wrapper {
  margin-bottom: 10px;
  display: flex;
}
.todo_item-title {
  color: #e6a23c;
}
.todo_item-content {
  word-break: break-all;
  white-space: normal;
  height: max-content;
  margin-right: 20px;
  color: #606266;
}
</style>
