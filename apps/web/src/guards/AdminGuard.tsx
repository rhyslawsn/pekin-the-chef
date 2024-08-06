export const AdminGuard = ({ children }) => {
  // const { isAdmin } = useAuth();

  // if (!isAdmin) return <Navigate to={{ pathname: "/" }} replace />;

  return children;
};
