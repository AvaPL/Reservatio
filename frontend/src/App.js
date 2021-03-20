import './App.scss';
import {Navigation} from "./navigation/Navigation";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import Appointments from "./appointments/Appointments";
import Explore from "./explore/Explore";
import Favorites from "./favorites/Favorites";
import Search from "./search/Search";
import PageNotFound from "./pagenotfound/PageNotFound";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/not-found" component={PageNotFound}/>
                    <Route component={RoutesWithNavigation}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

const RoutesWithNavigation = () =>
    (
        <div>
            <Navigation/>
            <Switch>
                <Route exact path="/"><Redirect to="/explore"/></Route>
                <Route exact path="/appointments" component={Appointments}/>
                <Route exact path="/explore" component={Explore}/>
                <Route exact path="/favorites" component={Favorites}/>
                <Route exact path="/search" component={Search}/>
                <Redirect to="/not-found"/>
            </Switch>
        </div>
    )

export default App;
