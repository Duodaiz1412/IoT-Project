import React, { Suspense, useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { CSpinner } from "@coreui/react";
import AppSidebar from "./components/AppSidebar";
import "./styles/style.scss";


const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

function App() {
  return (
    <>
      <HashRouter>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route path="*" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </>
  );
}

export default App;
