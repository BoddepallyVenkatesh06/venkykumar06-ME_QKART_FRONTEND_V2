import Register from "./components/Register";
import Product from "./components/Products";
import Login from "./components/Login";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";
import ipConfig from "./ipConfig.json";
import {Switch,Route} from "react-router-dom";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
  
        <Switch>
            <Route  path="/register">
             <Register />
            </Route>
            <Route  path="/login">
              <Login />
              <Route  path="/checkout">
             <Product /> 
            </Route>
            <Route  path="/Thanks">
             <Product /> 
            </Route>
            </Route>   
            <Route  path="/">
             <Product /> 
            </Route>
        </Switch>
  
    </div>
  );
}

export default App;
