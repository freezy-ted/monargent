import { useState } from "react";
import App from "./App.jsx";
import Landing from "./Landing.jsx";

export default function Root() {
  const [showApp, setShowApp] = useState(false);
  if (showApp) return <App />;
  return <Landing onStart={() => setShowApp(true)} />;
}
