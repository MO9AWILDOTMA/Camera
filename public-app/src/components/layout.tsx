"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";

const themeConfig = {
  withMT: true,
  defaultProps: {},
  styles: {},
  theme: {
    colors: {},
    fontFamily: {},
  },
};

export function Layout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider value={themeConfig}>{children}</ThemeProvider>;
}

export default Layout;
