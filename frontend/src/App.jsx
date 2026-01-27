import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import SignIn from "./Pages/Sign-in";
import Quiz from "./Pages/Quiz";
import Dashboard from "./Pages/Dashboard";
import ShelterLogin from "./Pages/ShelterLogin"; // Import Shelter Login page
import ShelterDashboard from "./Pages/ShelterDashboard"; // Import Shelter Dashboard page
import { ChakraProvider } from "@chakra-ui/react";
import Shelter from "./Pages/Shelter";
import AdoptionForm from "./Pages/Adoption";
import PreviousAdoptions from "./Pages/PreviousAdoptions";
import ManageAdoptions from "./Pages/ManageAdoptions";

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shelter" element={<Shelter />} />
          <Route path="/shelter-login" element={<ShelterLogin />} />
          <Route path="/shelter-dashboard" element={<ShelterDashboard />} />
          <Route path="/adoption" element={<AdoptionForm />} />
          <Route path="/previous-adoptions" element={<PreviousAdoptions />} />
          <Route path="/manage-adoptions" element={<ManageAdoptions />} />
        </Routes>
      </Router>
    </ChakraProvider >
  );
};

export default App;