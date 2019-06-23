import Index from "views/Index";
import Profile from "views/examples/Profile";
// import Maps from "views/examples/Maps";
import Register from "views/examples/Register";
import Login from "views/examples/Login";
import Logout from './views/examples/Logout';
import Home from './views/examples/HomePage';
// import Tables from "views/examples/Tables";
// import Icons from "views/examples/Icons";

var routes = [
  {
    path: "/Index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    key: 'dashboard',
    layout: "/admin"
  },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-planet text-blue",
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: Maps,
  //   layout: "/admin"
  // },
  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: Profile,
  //   layout: "/admin"
  // }
  // ,
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth"
  }
  ,
  {
    path: "/",
    name: "Logout",
    icon: "ni ni-bullet-list-67 text-red",
    component: Logout,
    layout: ""
  }
];
export default routes;
