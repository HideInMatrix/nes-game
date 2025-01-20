export const publicRoutes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/game/:id",
    name: "game",
    component: () => import("../views/Game.vue"),
  },
];
