import { createStore } from "vuex";
import { addLocalStorage, delLocalStorage } from "../utils/localStorage/index";

const store = createStore({
  state: {
    user: [],
    todos: [],
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getTodos(state) {
      return state.todos;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload[1];
      delLocalStorage(payload[0]);
      addLocalStorage(payload[0], JSON.stringify(state.user));
    },
    setUserData(state, userData) {
      state.user.user = userData;
      delLocalStorage("KapayJI-login-system");
      addLocalStorage("KapayJI-login-system", JSON.stringify(state.user));
    },
    setTodos(state, todos) {
      state.todos = todos;
    },
  },
  actions: {
    setUser({ commit }, user) {
      commit("setUser", user);
    },
    setUserData({ commit }, userData) {
      commit("setUserData", userData);
    },
    setTodos({ commit }, todos) {
      commit("setTodos", todos);
    },
  },
});
export default store;
