import { createBrowserRouter } from "react-router-dom";
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
import AdvertiseProperty from "../Pages/Dashboard/Admin/AdvertiseProperty";
import AllProperties from "../Pages/AllProperty/AllProperties";
import PropertyDetails from "../Pages/AllProperty/propertyDetails";
import MakeOffer from "../Pages/Dashboard/User/MakeOffer"; // ✅ Ensure this file exists

import PrivateRoute from './../Routes/PrivateRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayouts,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "all-properties",
        Component: AllProperties
      },
      {
        path: "property-details/:id",
        Component: PropertyDetails
      },
      {
        path: "make-offer/:id",
        element: (
          <PrivateRoute>
            <MakeOffer />
          </PrivateRoute>
        )
      }
    ]
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login
      },
      {
        path: "register",
        Component: Register
      }
    ]
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // ✅ User Routes
      {
        path: "user/profile",
        Component: MyProfile
      },
      {
        path: "user/wishlist",
        Component: Wishlist
      },
      {
        path: "user/property-bought",
        Component: PropertyBought
      },
      {
        path: "user/my-reviews",
        Component: MyReviews
      },

      // ✅ Agent Routes
      {
        path: "agent/profile",
        Component: AgentProfile
      },
      {
        path: "agent/add-property",
        Component: AddProperty
      },
      {
        path: "agent/my-properties",
        Component: MyProperties
      },
      {
        path: "agent/sold-properties",
        Component: MySoldProperties
      },
      {
        path: "agent/requests",
        Component: RequestedProperties
      },

      // ✅ Admin Routes
      {
        path: "admin/profile",
        Component: AdminProfile
      },
      {
        path: "admin/manage-users",
        Component: ManageUsers
      },
      {
        path: "admin/manage-properties",
        Component: ManageProperties
      },
      {
        path: "admin/manage-reviews",
        Component: ManageReviews
      },
      {
        path: "admin/advertise",
        Component: AdvertiseProperty
      }
    ]
  }
]);
