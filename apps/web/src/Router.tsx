import { Route, Routes } from "react-router-dom";
import { Home } from "./screens/Home";
import { Recipe } from "./screens/Recipe";

export const Router = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path=":username/:slug">
          <Route index element={<Recipe />} />
        </Route>
      </Route>
    </Routes>
  );
};
