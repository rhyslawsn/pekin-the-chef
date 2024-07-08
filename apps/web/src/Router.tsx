import { Route, Routes } from "react-router-dom";
import { Home } from "./screens/Home";
import { Recipe } from "./screens/Recipe";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:username/:slug" element={<Recipe />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
