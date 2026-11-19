import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { startMetrics } from "./metrics";
import "./styles.css";

const Dashboard = lazy(() => import("./Dashboard"));
const dashboardPage = window.location.pathname === "/dashboard";
createRoot(document.getElementById("root")!).render(
 <StrictMode>{dashboardPage
  ? <Suspense fallback={<p>Loading dashboard…</p>}><Dashboard/></Suspense>
  : <App/>}
 </StrictMode>
);
if (!dashboardPage) {
 requestAnimationFrame(() => requestAnimationFrame(() => startMetrics()));
}
