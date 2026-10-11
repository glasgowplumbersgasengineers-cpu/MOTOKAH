import { createRoot } from "react-dom/client";
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

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
