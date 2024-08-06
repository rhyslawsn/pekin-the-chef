import { Route, Routes } from "react-router-dom";
import { Home } from "./screens/Home";
import { Recipe } from "./screens/Recipe";
import { Admin } from "./screens/Admin";
import { AdminGuard } from "./guards/AdminGuard";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:username/:slug" element={<Recipe />} />
      <Route
        path="/admin/create"
        element={
          <AdminGuard>
            <Admin />
          </AdminGuard>
        }
      />
    </Routes>
  );
};
