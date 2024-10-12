// App.js or index.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StripeContainer from "./StripeForm"; // Adjust the import path if needed
import SuccessPage from "./SuccessPage"; // Adjust the import path if needed
import CancelPage from "./CancelPage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StripeContainer />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
      </Routes>
    </Router>
  );
};

export default App;
