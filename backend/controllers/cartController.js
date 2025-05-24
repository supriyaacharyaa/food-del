import userModel from '../models/userModel.js'

//add items to user cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const itemId = req.body.itemId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cart = user.cartData || {};

    if (cart[itemId]) {
      cart[itemId] += 1;
    } else {
      cart[itemId] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData: cart });

    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


//remove items from cart
const removeFromCart = async(req,res)=>{

    try {
        let userData = await userModel.findById(req.body.userId);
     let cartData=  userData.cartData || {};
if (cartData[req.body.itemId]>1) 
    {
    cartData[req.body.itemId]-=1;
}  
else{
    delete cartData[req.body.itemId];
}   
await userModel.findByIdAndUpdate(req.body.userId,{cartData});
res.json({success:true,message:"Removed from Cart"})
    } catch (error) {
        res.json({success:false,message:"Error"})
    }
}

//fetch user cart data
const getCart = async (req, res) => {
  try {
    const userId = req.userId;  // Use userId from auth middleware

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cart = user.cartData || {};
    res.json({ success: true, cartData: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



export {addToCart,removeFromCart,getCart}