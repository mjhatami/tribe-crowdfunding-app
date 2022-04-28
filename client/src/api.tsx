import axios from "axios";
const instance = axios.create({
  baseURL: 'http://localhost:3001'
})

  const createIntent =  async (options:any, donationCode:string | undefined)  => {
    return await instance.post(`/stripe/intent/${donationCode}`,options)
    .then(res => {
      return res.data.data;
    }).catch(err=>{
      console.log('error',err)
    })

    
  };
  
  const api = {
    createIntent: createIntent,
  };
  
  export default api;
  