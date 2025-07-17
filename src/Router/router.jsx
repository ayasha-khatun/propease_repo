import {
  createBrowserRouter,
} from "react-router";
import Home from './../Pages/Home/Home/Home';
import RootLayouts from "../Layouts/RootLayouts";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import DashboardLayout from './../Layouts/DashboardLayout';
import MyProfile from './../Pages/Dashboard/User/MyProfile';
import Wishlist from './../Pages/Dashboard/User/Wishlist';
import PropertyBought from './../Pages/Dashboard/User/PropertyBought';
import MyReviews from './../Pages/Dashboard/User/MyReviews';
import AgentProfile from './../Pages/Dashboard/Agent/AgentProfile';
import AddProperty from './../Pages/Dashboard/Agent/AddProperty';
import MyProperties from './../Pages/Dashboard/Agent/MyProperties';
import MySoldProperties from './../Pages/Dashboard/Agent/MySoldProperties';
import RequestedProperties from './../Pages/Dashboard/Agent/RequestedProperties';
import AdminProfile from './../Pages/Dashboard/Admin/AdminProfile';
import ManageUsers from './../Pages/Dashboard/Admin/ManageUsers';
import ManageProperties from './../Pages/Dashboard/Admin/ManageProperties';
import ManageReviews from './../Pages/Dashboard/Admin/ManageReviews';
import PrivateRoute from './../Routes/PrivateRoute';


// User Dashboard Pages


// Agent Dashboard Pages

// Admin Dashboard Pages


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayouts,
    children: [
      {
        index: true,
        Component: Home
      }
    ]
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register
      }
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute>
       <DashboardLayout></DashboardLayout>
      </PrivateRoute>,
    children: [
      { 
        path: 'user/profile', 
        Component: MyProfile
      },
      { 
        path: 'user/wishlist', 
        Component: Wishlist
      },
      { 
        path: 'user/property-bought', 
        Component: PropertyBought 
      },
      { 
        path: 'user/my-reviews', 
        Component: MyReviews
      },

      { 
        path: 'agent/profile', 
        Component: AgentProfile
      },
      { 
        path: 'agent/add-property', 
        Component: AddProperty 
      },
      { 
        path: 'agent/my-properties', 
        Component: MyProperties
      },
      { 
        path:'agent/sold-properties', 
        Component: MySoldProperties
      },
      { 
        path:'agent/requests', 
        Component: RequestedProperties
      },

          // Admin routes
      { 
        path:'admin/profile', 
        Component: AdminProfile
      },
      { 
        path:'admin/manage-users',
        Component: ManageUsers
      },
      { 
        path: 'admin/manage-properties', 
        Component: ManageProperties 
      },
      { 
        path: 'admin/manage-reviews', 
        Component: ManageReviews
      },
      // { 
      //   path: 'admin/advertise', 
      //   Component: AdvertiseProperty 
      // },
    ]
  }
]);
