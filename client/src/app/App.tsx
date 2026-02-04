import "./App.css";
import type React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { AppRoutes } from "./Routes";
import { DefaultLayout } from "./layout";

import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";

const App: React.FC = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
    </Router>
  );
};

export default App;
