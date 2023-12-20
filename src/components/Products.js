import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart,{generateCartItemsFrom} from "./Cart";

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


const Products = () => {
  const { enqueueSnackbar} = useSnackbar();
  const [productData,updateProduct]=useState([]);
  const [isFetching,updateFecthed]=useState(false);
  const [productNotFound,updateProductNotFound]=useState(false);
  const [timerId,udpateTimerId]=useState("");
  const [userLoggedIn,updateUserLoggedIn]=useState(false);
  const [cartData,updateCartData]=useState([]);
  const [userCartItems,updateUserCartItems]=useState([]);
  const [userToken,updateUserToken]=useState("");

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try{
      updateFecthed(true)
      let url=config.endpoint;
     let product= await axios.get(`${url}/products`);
     updateProduct(product.data);
     updateFecthed(false);
     return product.data;
    }catch(e){
      console.log(e.message)
    }
  
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try{
      // updateProductNotFound(false)
      let url=config.endpoint;
     let product= await axios.get(`${url}/products/search?value=${text}`).catch((e)=>{updateProductNotFound(true)})
     
     if(product.data){
      updateProductNotFound(false);
      updateProduct(product.data);
     }
    }catch(e){
      console.log(e.message)
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimeout);
    // wait for 500 ms and make a call
    // 1st request
    let timerId = setTimeout(() => performSearch(event), 500);
    udpateTimerId(timerId);
  };

  useEffect( ()=>{
    async function onLoad(){
       const product=await performAPICall();
      let user=localStorage.getItem('username');
      if(user){
        updateUserLoggedIn(true)
      } 
      let token=localStorage.getItem('token');
      if(token){
        updateUserToken(token);
        const cartItems=await fetchCart(token);
        //console.log()
        updateUserCartItems(cartItems);// Array of objects with productId and quantity of products in cart
        const cartData=await generateCartItemsFrom(cartItems,product)
        updateCartData(cartData);
      }
    }
    onLoad();
  },[])

 


/**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
 const fetchCart = async (token) => {
  if (!token) return;

  try {
    // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
   let url=config.endpoint+'/cart';
   let cartDatas=await axios.get(url,{headers:{Authorization:`Bearer ${token}`}});
   return cartDatas.data;

  } catch (e) {
    if (e.response && e.response.status === 400) {
      enqueueSnackbar(e.response.data.message, { variant: "error" });
    } else {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
    }
    return null;
  }
};


// TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
/**
 * Return if a product already is present in the cart
 *
 * @param { Array.<{ productId: String, quantity: Number }> } items
 *    Array of objects with productId and quantity of products in cart
 * @param { String } productId
 *    Id of a product to be checked
 *
 * @returns { Boolean }
 *    Whether a product of given "productId" exists in the "items" array
 *
 */
const isItemInCart = (items, productId) => {
  // items is whole data array
  for(let i=0;i<items.length;i++){
    // console.log(items[i])
      if(items[i]['_id']===productId){
        enqueueSnackbar('Item already in cart. Use the cart sidebar to update quantity or remove item.',{variant:"warning"});
        return true;
      }
  }
  return false;
};

/**
 * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
 *
 * @param {string} token
 *    Authentication token returned on login
 * @param { Array.<{ productId: String, quantity: Number }> } items
 *    Array of objects with productId and quantity of products in cart
 * @param { Array.<Product> } products
 *    Array of objects with complete data on all available products
 * @param {string} productId
 *    ID of the product that is to be added or updated in cart
 * @param {number} qty
 *    How many of the product should be in the cart
 * @param {boolean} options
 *    If this function was triggered from the product card's "Add to Cart" button
 *
 * Example for successful response from backend:
 * HTTP 200 - Updated list of cart items
 * [
 *      {
 *          "productId": "KCRwjF7lN97HnEaY",
 *          "qty": 3
 *      },
 *      {
 *          "productId": "BW0jAAeDJmlZCF8i",
 *          "qty": 1
 *      }
 * ]
 *
 * Example for failed response from backend:
 * HTTP 404 - On invalid productId
 * {
 *      "success": false,
 *      "message": "Product doesn't exist"
 * }
 */
const addToCart = async (token, items,products,productId,qty,options = { preventDuplicate: false }) => {

      if(options.preventDuplicate===true){
        try{
            let url=config.endpoint+'/cart';
            let res=await axios.post(url,{"productId":productId,"qty":qty},{headers:{Authorization:`Bearer ${token}`}});
            const cartData=await generateCartItemsFrom(res.data,products)
            updateCartData(cartData);

        }catch(e){
          console.log(e)
        }
      }
      else {
            // udpate only quantity
            // items.qty++
            let index;
            for(let i=0;i<items.length;i++){
              if(items[i]['productId']===productId){
                index=i;
              }
            }
            if(options.preventDuplicate==='handleAdd'){
              items[index]['qty']++;
            }
            else{
                items[index]['qty']--;
            }
            //  udpate ite4ms
            let url=config.endpoint+'/cart';
            let res=await axios.post(url,{"productId":productId,"qty":items[index]["qty"]},{headers:{Authorization:`Bearer ${token}`}});
            const cartData=await generateCartItemsFrom(res.data,products)
            updateCartData(cartData);
      }
};


let addItems=(e)=>{
  if(!userLoggedIn){
    enqueueSnackbar("Login to add an item to the Cart",{variant:"warning"}) }
  else {
    let result=isItemInCart(cartData,e.target.value)
    if(!result){
      addToCart(userToken,userCartItems,productData,e.target.value,1,{preventDuplicate: true});
    }else{
      enqueueSnackbar('Item already in cart. Use the cart sidebar to update quantity or remove item.',{variant:"warning"});
    }
  }
  
  
}

const onButtonClick=(id,handle)=>{
  console.log("Button Click")
  console.log(id,handle)
// token, items,products,productId,qty,options = { preventDuplicate: false }
  addToCart(userToken,userCartItems,productData,id,null, { preventDuplicate: handle })
};

  return (
    <div>
      <Header  hasHiddenAuthButtons={false}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
        className="search-desktop"
        size="small"
        onChange={(e)=>{debounceSearch(e.target.value,timerId)}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />

      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        onChange={(e)=>{debounceSearch(e.target.value,timerId)}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />

       <Grid container justifyContent="center" >
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
       </Grid>

      
      {
        isFetching?<div className={"loading"}>
                      <CircularProgress />
                      <h3>Loading Products</h3>
                    </div>
                  : !productNotFound?
                  <>
                  {
                    !userLoggedIn?
                    <Grid container >
                    <Grid container spacing={{ xs: 2, md: 3 ,lg:1 }} >
                      {productData.map((x)=>
                         (<Grid item lg={3} md={6} sm={6} xs={6} mt={2} mb={2} key={x['_id']}  >
                          <ProductCard product={x} handleAddToCart={(e)=>{addItems(e)}}/>
                        </Grid>
                        )
                        )}
                    </Grid>
                  </Grid>:
                        <Grid container  >
                        <Grid container spacing={{ xs: 2, md: 3 ,lg:1 }} md={9} >
                          {productData.map((x)=>
                             (<Grid item lg={4} md={4} sm={6} xs={6} mt={2} mb={2} key={x['_id']}  >
                              <ProductCard product={x} handleAddToCart={(e)=>{addItems(e)}}/>
                            </Grid>
                            )
                            )}
                        </Grid>
                        <Grid md={3} sm={12} xs={12} sx={{backgroundColor:'#E9F5E1'}} >
                           <Cart product={productData} items={cartData} handleQuantity={onButtonClick}  />
                           {/* handleQuantity={onButtonClick} */}
                        </Grid>
                      </Grid>
                  }
                  </>
                    :<div className={"loading"}>
                    <SentimentDissatisfied/>
                    <h3>No products found</h3>
                  </div>          
      }
      <Footer />
    </div>
  );
};

export default Products;
