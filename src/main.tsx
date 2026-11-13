import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import "./index.css";

// Google Translate rewrites text nodes directly in the DOM, outside React's
// control. When React later reconciles those nodes it no longer recognizes,
// removeChild/insertBefore throw "not a child of this node" and can crash
// or visually break the whole page. Make both operations tolerate a node
// Google Translate has already moved or replaced instead of throwing.
if (typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (import.meta.env.DEV) {
        console.warn("Skipped removeChild on a node no longer owned by its parent (likely Google Translate DOM rewrite)", child);
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (import.meta.env.DEV) {
        console.warn("Skipped insertBefore with a reference node no longer owned by its parent (likely Google Translate DOM rewrite)", referenceNode);
      }
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

// iOS Capacitor: after the keyboard dismisses, the WKWebView sometimes keeps
// the body at the shrunk height, hiding the bottom tab bar and clipping content.
// Force a layout recalc on every visualViewport resize (covers both show and hide).
if (window.visualViewport && Capacitor.isNativePlatform()) {
  let pendingResize: number | null = null;
  window.visualViewport.addEventListener("resize", () => {
    if (pendingResize) cancelAnimationFrame(pendingResize);
    pendingResize = requestAnimationFrame(() => {
      pendingResize = null;
      document.documentElement.style.height = window.visualViewport!.height + "px";
      requestAnimationFrame(() => {
        document.documentElement.style.height = "";
      });
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
