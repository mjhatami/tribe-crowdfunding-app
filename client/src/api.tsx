const createPaymentIntent = (options:any) => {
    return window
      .fetch(`/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
      })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          return null;
        }
      })
      .then(data => {
        if (!data || data.error) {
          console.log("API error:", { data });
          throw new Error("PaymentIntent API Error");
        } else {
          return data.client_secret;
        }
      });
  };
  
  const getProductDetails = (options:any) => {
    return window
      .fetch(`/product-details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          return null;
        }
      })
      .then(data => {
        if (!data || data.error) {
          console.log("API error:", { data });
          throw Error("API Error");
        } else {
          return data;
        }
      });
  };
  
  const getDonationBoxDetail =  (options:any)  => {
    return window
      .fetch(`/donation-box/${options.donationCode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          return null;
        }
      })
      .then(data => {
        if (!data || data.error) {
          console.log("API error:", { data });
          throw Error("API Error");
        } else {
          return data;
        }
      });
  };
  
  const api = {
    createPaymentIntent,
    getDonationBoxDetail: getDonationBoxDetail,
    getProductDetails: getProductDetails
  };
  
  export default api;
  