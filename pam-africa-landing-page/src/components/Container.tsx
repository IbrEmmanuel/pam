import React, { ReactNode } from "react";
import NavBar from "./NavBar";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default Container;
