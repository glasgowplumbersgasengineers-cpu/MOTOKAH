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
// Force a layout recalc once the keyboard has closed. This used to run on every
// visualViewport resize, which iOS also fires while typing (the suggestion bar
// shows and hides), and the shrunk height clamped the scroll so forms jumped to the top.
if (Capacitor.isNativePlatform()) {
  // Inside the app the page must never zoom (pinch, double-tap or focusing a field).
  // The website keeps pinch-zoom for accessibility.
  document
    .querySelector('meta[name="viewport"]')
    ?.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content");
  import("@capacitor/keyboard").then(({ Keyboard }) => {
    Keyboard.addListener("keyboardDidHide", () => {
      const y = window.scrollY;
      document.documentElement.style.height = window.innerHeight + "px";
      requestAnimationFrame(() => {
        document.documentElement.style.height = "";
        window.scrollTo(0, y);
      });
    });
  }).catch(() => {});
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
