// import { createContext, useEffect, useState } from "react";
// // import { food_list } from "../assets/assets";
// import axios from 'axios'

// export const StoreContext = createContext(null)

// const StoreContextProvider=(props)=>{

//     // const [cartItems,setCartItems]=useState({});
//    const [cartItems, setCartItems] = useState(() => {
//   try {
//     const savedCart = localStorage.getItem("cartItems");
//     if (savedCart && savedCart !== "undefined") {
//       return JSON.parse(savedCart);
//     }
//   } catch (error) {
//     console.error("Failed to parse cartItems from localStorage", error);
//   }
//   return {};
// });

//     const url ="http://localhost:4000";
//     const [token,setToken]=useState("")

//     const [food_list,setFoodList]=useState([])

//     const addToCart = async (itemId) => {
//   setCartItems((prev) => {
//     // Defensive check: if prev is undefined, set to empty object
//     const prevCart = prev || {};
//     // Get current quantity or 0 if none
//     const quantity = prevCart[itemId] || 0;
//     return {
//       ...prevCart,
//       [itemId]: quantity + 1,
//     };
//   });

//   if(token){
//     try {
//       await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   }
// }

//     // const removeFromCart =async(itemId)=>{
//     //    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
//     //    if (token) {
//     //     await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
//     //    }
//     // }

//     const removeFromCart = async (itemId) => {
//   setCartItems((prev) => {
//     const quantity = prev[itemId] || 0;
//     if (quantity <= 1) {
//       const { [itemId]: _, ...rest } = prev;
//       return rest; // removes item
//     } else {
//       return { ...prev, [itemId]: quantity - 1 };
//     }
//   });

//   if (token) {
//     try {
//       await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
//     } catch (error) {
//       console.error("Error removing from cart:", error);
//     }
//   }
// };


//     const getTotalCartAmount = () => {
//   let totalAmount = 0;
//   for (const item in cartItems) {
//     if (cartItems[item] > 0) {
//       const itemInfo = food_list.find((product) => product._id === item);

//       if (itemInfo && itemInfo.price) {
//         totalAmount += itemInfo.price * cartItems[item];
//       } else {
//         console.warn(Item with id ${item} not found in food_list or missing price);
//       }
//     }
//   }
//   return totalAmount;
// };

// const loadCartData = async (token) => {
//   try {
//     const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
//     const serverCart = response.data.cartData;

//     if (serverCart && Object.keys(serverCart).length > 0) {
//       setCartItems(serverCart);
//     } else {
//       const savedCart = localStorage.getItem("cartItems");
//       if (savedCart && savedCart !== "undefined") {
//         setCartItems(JSON.parse(savedCart));
//       }
//     }
//   } catch (error) {
//     console.error("Error loading cart from backend:", error);
//   }
// };

//    const fetchFoodList = async () => {
//   const response = await axios.get(url + "/api/food/list");
//   setFoodList(response.data.data);
// };

//     useEffect(()=>{
// async function loadData() {
//     await fetchFoodList()
//      if (localStorage.getItem("token")) {
//     setToken(localStorage.getItem("token"));
//     await loadCartData(localStorage.getItem("token"));
//  }
//  }
//  loadData();
//     },[])

//  useEffect(() => {
//   if (token) {
//     localStorage.setItem("token", token);
//   }
// }, [token]);


//     useEffect(() => {
//   localStorage.setItem("cartItems", JSON.stringify(cartItems));
// }, [cartItems]);

//     const contextValue ={
//          food_list,
//          cartItems,
//          setCartItems,
//          addToCart,
//          removeFromCart,
//          getTotalCartAmount,
//          url,
//          token,
//          setToken

//     }
//     return(
//         <StoreContext.Provider value={contextValue} >
//             {props.children}
//         </StoreContext.Provider>
//     )
// }

// export default StoreContextProvider

import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // Initialize cartItems from localStorage or empty object
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart && savedCart !== "undefined") {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error("Failed to parse cartItems from localStorage", error);
    }
    return {};
  });

  // Add item to cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const prevCart = prev || {};
      const quantity = prevCart[itemId] || 0;
      return {
        ...prevCart,
        [itemId]: quantity + 1,
      };
    });

    if (token) {
      try {
        await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const quantity = prev[itemId] || 0;
      if (quantity <= 1) {
        const { [itemId]: _, ...rest } = prev;
        return rest; // remove item
      } else {
        return { ...prev, [itemId]: quantity - 1 };
      }
    });

    if (token) {
      try {
        await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  // Calculate total amount of cart
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);

        if (itemInfo && itemInfo.price) {
          totalAmount += itemInfo.price * cartItems[item];
        } else {
          console.warn(`Item with id ${item} not found in food_list or missing price`);
        }
      }
    }
    return totalAmount;
  };

  // Load cart data from backend or localStorage
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
      const serverCart = response.data.cartData;

      if (serverCart && Object.keys(serverCart).length > 0) {
        setCartItems(serverCart);
      } else {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart && savedCart !== "undefined") {
          setCartItems(JSON.parse(savedCart));
        }
      }
    } catch (error) {
      console.error("Error loading cart from backend:", {
        message: error.message,
  status: error.response?.status,
  data: error.response?.data,
  headers: error.response?.headers,
  config: error.config,
      });
    }
  };

  // Fetch food list from backend
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // On mount: fetch food list and cart data (if logged in)
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();

      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  // Save token to localStorage when it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  // Save cartItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Clean cartItems by removing invalid or missing price items
  // Run only if food_list and cartItems are loaded (non-empty)
  useEffect(() => {
    if (food_list.length === 0) return;
    if (Object.keys(cartItems).length === 0) return;

    let changed = false;
    const validCart = { ...cartItems };

    for (const itemId in cartItems) {
      const itemExists = food_list.some(
        (food) => food._id === itemId && typeof food.price === "number"
      );
      if (!itemExists) {
        delete validCart[itemId];
        changed = true;
        console.warn(`Removed invalid cart item with id ${itemId}`);
      }
    }

    if (changed) {
      setCartItems(validCart);
    }
  }, [food_list, cartItems]);

  useEffect(() => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}, [cartItems]);




  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
