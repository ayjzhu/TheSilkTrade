import About from "./pages/About";
import Listings from "./pages/Listings";
import UserProfile from "./pages/UserProfile";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Sale from "./pages/Sale";
import Rent from "./pages/Rent";
import MoreInfo from "./pages/MoreInfo";
import Cart from "./pages/Cart";
import Logging from "./pages/Logging"
import { Switch, Route} from 'react-router-dom'
import React from "react";

function App() {
  return (
      <div className="App">
          <Switch>
            <Route exact path="/About" component={About}/>
            <Route exact path="/Listings" component={Listings} />
            <Route exact path="/UserProfile" component={UserProfile}/>
            <Route exact path="/Sale" component={Sale}/>
            <Route exact path="/Rent" component={Rent}/>
            <Route exact path="/Home" component={Home}/>
            <Route exact path="/Listing/:id" component={MoreInfo}/>
            <Route exact path="/Cart" component={Cart}/>
            <Route exact path="/Logging" component={Logging}/>
            <Route exact path="/"><Landing /></Route>
          </Switch>
      </div>
  );
}

export default App;
