import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Home } from "pages/Home";
import { CreatePoint } from "pages/CreatePoint";

export const Routes = () => (
  <BrowserRouter>
    <Route path="/" exact component={Home} />
    <Route path="/create-point" exact component={CreatePoint} />
  </BrowserRouter>
);
