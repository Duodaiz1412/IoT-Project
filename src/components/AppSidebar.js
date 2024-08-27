import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CSidebar,
  CSidebarHeader,
  CSidebarBrand,
  CCloseButton,
  CSidebarToggler,
  CSidebarFooter,
} from "@coreui/react";

import { AppSidebarNav } from "./AppSidebarNav";

import navigation from "../_nav";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  return (
    <>
      <CSidebar
        className="border-end"
        colorScheme="dark"
        position="fixed"
        visible={sidebarShow}
        unfoldable={unfoldable}
        onVisibleChange={(visible) => {
          dispatch({ type: "set", sidebarShow: visible });
        }}
      >
        <CSidebarHeader className="border-bottom">
          <CSidebarBrand customClassName="sidebar-brand-full">
            IoT Project
          </CSidebarBrand>

        </CSidebarHeader>
        <AppSidebarNav items={navigation} />
        <CSidebarFooter className="border-top d-none d-lg-flex">
        </CSidebarFooter>
      </CSidebar>
    </>
  );
};

export default React.memo(AppSidebar);
