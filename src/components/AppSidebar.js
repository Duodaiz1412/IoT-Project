import React, { useState } from "react";
import {
  CSidebar,
  CSidebarHeader,
  CSidebarBrand,
  CCloseButton,
  CSidebarToggler,
  CSidebarFooter
} from "@coreui/react";

import { AppSidebarNav } from "./AppSidebarNav";

import navigation from "../_nav";

const AppSidebar = () => {
  const [sidebarShow, setSidebarShow] = useState(true);
  const [unfoldable, setUnfoldable] = useState(false);
  const [isClose, setIsClose] = useState(false);
  return (
    <>
      <CSidebar 
        className="border-end" 
        colorScheme="dark" 
        position="fixed"
        visible= {sidebarShow}
        unfoldable= {unfoldable}
        onVisibleChange={(visible) => {
          setSidebarShow(visible);
        }}
        narrow= {isClose}
        >
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand>IoT Project</CSidebarBrand>
          <CCloseButton
            onClick = {() => setIsClose(!isClose)}
          />
        </CSidebarHeader>
        <AppSidebarNav items={navigation} />
        <CSidebarFooter className="border-top d-none d-lg-flex">
            <CSidebarToggler
              onClick= {() => setUnfoldable(!unfoldable)}
          />
        </CSidebarFooter>
        
      </CSidebar>
    </>
  );
};

export default React.memo(AppSidebar);
