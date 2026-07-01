// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";

// const WorkspaceGuard = () => {
//   const { accessToken, workspaceStatus } = useAuthStore();
//   const location = useLocation();

//   if (!accessToken) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (
//     workspaceStatus === "setup" &&
//     !location.pathname.startsWith("/workspace/setup")
//   ) {
//     return <Navigate to="/workspace/setup" replace />;
//   }

//   if (
//     workspaceStatus === "invited" &&
//     !location.pathname.startsWith("/workspace/invite")
//   ) {
//     return <Navigate to="/workspace/invite" replace />;
//   }

//   if (
//     workspaceStatus === "pending" &&
//     !location.pathname.startsWith("/workspace/pending")
//   ) {
//     return <Navigate to="/workspace/pending" replace />;
//   }

//   if (
//     workspaceStatus === "active" &&
//     location.pathname.startsWith("/workspace/")
//   ) {
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// };

// export default WorkspaceGuard;
