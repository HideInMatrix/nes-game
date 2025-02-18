export const publicRoutes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/games",
    name: "games",
    component: () => import("../views/Games.vue"),
  },
  {
    path: "/game/:id",
    name: "game",
    component: () => import("../views/Game.vue"),
  },
  {
    path: "/local-games",
    name: "localGames",
    component: () => import("../views/LocalGames.vue"),
  },
];
