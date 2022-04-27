import axios from "axios";
axios.defaults.baseURL = 'server'
// const createPaymentIntent = (options:any) => {
//   };
  
//   const getProductDetails = (options:any) => {
//     return window
//       .fetch(`/product-details`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       })
//       .then(res => {
//         if (res.status === 200) {
//           return res.json();
//         } else {
//           return null;
//         }
//       })
//       .then(data => {
//         if (!data || data.error) {
//           console.log("API error:", { data });
//           throw Error("API Error");
//         } else {
//           return data;
//         }
//       });
//   };
  
  const createIntent =  async (options:any, donationCode:string | undefined)  => {
    return await axios.post(`http://localhost:8080/stripe/intent/${donationCode}`,options)
    .then(res => {
      // console.log('RRRRRRRR',res);
      return res.data.data;
    })

    
    // window
    //   .fetch(`${process.env.SERVER_URL}/donation-box/${donationCode}`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     }
    //   })
    //   .then(res => {
    //     if (res.status === 200) {
    //       return res.json();
    //     } else {
    //       return null;
    //     }
    //   })
    //   .then(data => {
    //     if (!data || data.error) {
    //       console.log("API error:", { data });
    //       throw Error("API Error");
    //     } else {
    //       console.log('DATA', data);
    //       return data;
    //     }
    //   });
  };
  
  const api = {
    // createPaymentIntent,
    createIntent: createIntent,
    // getProductDetails: getProductDetails
  };
  
  export default api;
  