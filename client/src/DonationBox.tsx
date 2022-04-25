import React, { useEffect, useState, useRef } from "react";
import { useQuery } from 'react-query'
import { loadStripe, Stripe  } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import DemoText from "./components/DemoText";
import CheckoutForm from "./components/CheckoutForm";
import { useParams, useSearchParams } from "react-router-dom";
import './donation-box.css';

import api from "./api";

function DonationBox(props:any) {

  const [query] = useSearchParams()

  const { donationCode } = useParams();
  const amount = query.get('amount')
  const { data, isSuccess } = useQuery('stripeConfig', async () => {
    const data = await api.createIntent({amount}, donationCode)
    const s = loadStripe( data.config.publishKey);
    return {...data,stripePromise:s};
  });
  
  return (
    <div
    className="Tipping"
    // style={{ visibility: (stage == 0) ? "visible" : "hidden" }}
  >
    <div className="sr-root">
      <div className="sr-main">
        {/* <img alt="logo" src={} /> */}
        <header className="sr-header">
          <div className="sr-header__logo" />
        </header>
        {isSuccess && data.stripePromise && 
          <Elements stripe={data.stripePromise} >
            <CheckoutForm clientSecret={data.clientSecret} amount={amount} currency={data.currency}
            />
          </Elements>
        }
      </div>
      {/* <img
        id="cover"
        alt="cover"
        src={require("./cover.png")}
        width="140"
        height="160"
      /> */}

      <div className="sr-content">
        <div className="pasha-image-stack">
          
        <img
          alt=""
          src="https://picsum.photos/280/320?random=2"
          width="140"
          height="160"
        />
        <img
          alt=""
          src="https://picsum.photos/280/320?random=3"
          width="140"
          height="160"
        />
        <img
          alt=""
          src="https://picsum.photos/280/320?random=4"
          width="140"
          height="160"
        />
        </div>
      </div>
    </div>
    <DemoText />
  </div>
   
  );

  
}

export default DonationBox;
