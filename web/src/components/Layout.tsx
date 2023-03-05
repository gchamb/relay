import React from "react";
import Nav from "./Nav";

export default function Layout(props: { children: React.ReactNode; className: string }) {
  return (
    <main className={props.className}>
      {/* Navigation */}
      <Nav />
      {props.children}
    </main>
  );
}
