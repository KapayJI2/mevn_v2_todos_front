import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage";
import RegistrationPage from "@/pages/RegistrationPage";
import LoginPage from "@/pages/LoginPage";
import UserPage from "@/pages/UserPage";
import TodosPage from "@/pages/TodosPage";
import UserInfoChange from "@/components/UI/UserInfoChange";
const routerHistory = createWebHistory();

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/user/:id",
      name: "user",
      component: UserPage,
    },
    {
      path: "/user/:id/todos",
      name: "todos",
      component: TodosPage,
    },
    {
      path: "/user/:id/user-info",
      name: "user-info",
      component: UserInfoChange,
    },
    {
      path: "/registration",
      name: "registration",
      component: RegistrationPage,
    },
  ],
});
export default router;
