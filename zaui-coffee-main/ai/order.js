import axios from "axios";


export const getMacAndOrderData = async (orderData) => {
    const requestConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: orderData,
      baseURL: 'http://localhost:3500/getMac',
    };
  
    try {
      const result = await axios(requestConfig);
      return result.data;
    } catch (error) {
      console.error('Error fetching MAC and order data:', error);
      throw error;
    }
  };
  