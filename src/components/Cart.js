import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory} from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  // console.log(cartData)
    let map=new Map();
    for(let i=0;i<productsData.length;i++){
      map.set(productsData[i]["_id"],productsData[i]);
    }
    let cartItems=[];
    

    cartData.forEach((x)=>{
      let value=map.get(x['productId']);
      value["quantity"]=x.qty;
      cartItems.push(value)
    })

    // for(let i=0;i<cartData.length;i++){
    //   let value=map.get(cartData[i]["productId"]);
    //   value["quantity"]=cartData[i].qty;
    //   console.log(value)
    //   cartItems.push(value)
    // }
    return cartItems;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {

  let value=0;
  for(let i=0;i<items.length;i++){
    value+=items[i].quantity*items[i].cost;
  }
return value;

};

export const getTotalItems=(items=[])=>{
  let qty=0;
  for(let i=0;i<items.length;i++){
    qty+=items[i].quantity;
  }
  return  qty;
}

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * 
 */
const ItemQuantity = ({value,handleAdd,handleDelete,productId}) => {


  return (
    <Stack direction="row" alignItems="center">
          <IconButton size="small" color="primary" onClick={(e)=>{handleDelete(productId,'-')}}>
          <RemoveOutlined />
          </IconButton>
          <Box padding="0.5rem" data-testid="item-qty">
           {value}
          </Box>
          <IconButton size="small" color="primary" onClick={(e)=>{handleAdd(productId,"handleAdd")}}>
           <AddOutlined />
          </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * 
 */


function DisplayCartItems(props){
  const {image,name,cost,quantity,"_id":id}=props.items;
  
  return (
    
    <Box display="flex" alignItems="flex-start" padding="1rem">
        <Box className="image-container">
            <img
                // Add product image
                src={image}
                // Add product name as alt eext
                alt={name}
                width="100%"
                height="100%"
            />
        </Box>
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="6rem"
            paddingX="1rem"
        >
            <div>{name}</div>
            {/* Add product name */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
              {
                !props.isReadOnly?
                    <ItemQuantity
                    value={quantity}
                    handleAdd={props.buttonClick}
                    handleDelete={props.buttonClick}
                    productId={id}
                  // Add required props by checking implementation
                  />
                  :
                  <Box>
                    Qty:{quantity}
                  </Box>
              }
            
            <Box padding="0.5rem" fontWeight="700">
                ${cost}
                {/* Add product cost */}
            </Box>
            </Box>
        </Box>
    </Box>
  )
}




const Cart = ({products,items = [],handleQuantity,isReadOnly}) => {
 let history=useHistory();
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart" >
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

          {
            items.map((values)=>{
                 return (isReadOnly ? (<DisplayCartItems isReadOnly items={values} buttonClick={handleQuantity} key={values['_id']}/>)
                :(<DisplayCartItems  items={values} buttonClick={handleQuantity} key={values['_id']}/>)
              )
            }
            )
          }

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            {
              // console.log(window.location.pathname)
              window.location.pathname==="/checkout"?
                  <></>
                  :
                  <Button
                  color="primary"
                  variant="contained"
                  onClick={(e)=>{history.push('/checkout')}}
                  className="checkout-btn"
                  >
                  Checkout
                  </Button>
            }
          </Box>  
      </Box>
    </>
  );
};

export default Cart;
