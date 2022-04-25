import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import DemoText from "./components/DemoText";
import CheckoutForm from "./components/CheckoutForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DonationBox from "./DonationBox";
import {

  QueryClient,
  QueryClientProvider,
} from 'react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/donation-box/:donationCode" element={< DonationBox />} />
        </Routes>           
      </BrowserRouter>
    </QueryClientProvider>
  );

  
}

export default App;
