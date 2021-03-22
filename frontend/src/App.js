import './App.scss';
import {Navigation} from "./navigation/Navigation";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import Appointments from "./customer/appointments/Appointments";
import Explore from "./customer/explore/Explore";
import Favorites from "./customer/favorites/Favorites";
import Search from "./customer/search/Search";
import PageNotFound from "./pagenotfound/PageNotFound";
import Login from "./login/Login";
import Employees from "./serviceprovider/employees/Employees";
import Profile from "./serviceprovider/profile/Profile";
import Services from "./serviceprovider/services/Services";
import Statistics from "./serviceprovider/statistics/Statistics";
import {Component} from "react";

class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            isCustomer: true // TODO: Temporary
        }
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/not-found" component={PageNotFound}/>
                        <Route exact path="/login" component={Login}/>
                        {this.chooseRoutes()}
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }

    chooseRoutes() {
        if (this.state.isCustomer)
            return this.customerRoutes()
        else
            return this.serviceProviderRoutes()
    }

    customerRoutes() {
        const routes = [
            {name: "Explore", path: "/explore", component: Explore},
            {name: "Favorites", path: "/favorites", component: Favorites},
            {name: "Search", path: "/search", component: Search},
            {name: "Appointments", path: "/appointments", component: Appointments}
        ]
        return this.routesWithNavigation(routes)
    }

    routesWithNavigation(routes) {
        return (
            <Route>
                <Navigation routes={routes}/>
                <Switch>
                    <Route exact path="/"><Redirect to={routes[0].path}/></Route>
                    {routes.map(r => <Route exact path={r.path} component={r.component} key={r.name}/>)}
                    <Redirect to="/not-found"/>
                </Switch>
            </Route>
        );
    }

    serviceProviderRoutes() {
        const routes = [
            {name: "Statistics", path: "/statistics", component: Statistics},
            {name: "Services", path: "/services", component: Services},
            {name: "Employees", path: "/employees", component: Employees},
            {name: "Profile", path: "/profile", component: Profile}
        ]
        return this.routesWithNavigation(routes)
    }
}

export default App;
