"use client";

import React from "react";
import * as Toast from "@radix-ui/react-toast";
import Link from "next/link";

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <Toast.Root className="toast-root" open={true}>
        <Toast.Title className="toast-title">404 - Page Not Found</Toast.Title>
        <Toast.Description className="toast-description">
          Sorry, the page you are looking for does not exist.
        </Toast.Description>
        <Toast.Action
          className="toast-action"
          asChild
          altText="Go back to home"
        >
          <Link href="/">
            <a className="home-button">Go back to home</a>
          </Link>
        </Toast.Action>
      </Toast.Root>

      <Toast.Viewport className="toast-viewport" />
    </div>
  );
};

export default NotFoundPage;
