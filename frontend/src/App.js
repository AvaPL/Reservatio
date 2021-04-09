import './App.scss';
import {Navigation} from "./navigation/Navigation";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Appointments from "./customer/appointments/Appointments";
import Explore from "./customer/explore/Explore";
import Favorites from "./customer/favorites/Favorites";
import Search from "./customer/search/Search";
import PageNotFound from "./pagenotfound/PageNotFound";
import Login from "./login/Login";
import Registration from "./registration/Registration";
import Employees from "./serviceprovider/employees/Employees";
import Profile from "./serviceprovider/profile/Profile";
import Services from "./serviceprovider/services/Services";
import Statistics from "./serviceprovider/statistics/Statistics";
import {Component} from "react";
import {authService} from "./auth/AuthService";

const customerRoutes = [
    {name: "Explore", path: "/explore", component: Explore},
    {name: "Favorites", path: "/favorites", component: Favorites},
    {name: "Search", path: "/search", component: Search},
    {name: "Appointments", path: "/appointments", component: Appointments}
]

const serviceProviderRoutes = [
    {name: "Statistics", path: "/statistics", component: Statistics},
    {name: "Services", path: "/services", component: Services},
    {name: "Employees", path: "/employees", component: Employees},
    {name: "Profile", path: "/profile", component: Profile}
]

class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = this.chooseRoutes()
    }

    chooseRoutes() {
        const routes = []
        if (authService.userHasRole('customer'))
            routes.push(...customerRoutes)
        if (authService.userHasRole('service_provider'))
            routes.push(...serviceProviderRoutes)
        const homeRedirect = this.homeRedirect(routes)
        return {
            routes: routes,
            homeRedirect: homeRedirect
        }
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/not-found" component={PageNotFound}/>
                        <Route exact path="/login"
                               render={props => <Login {...props} onLogin={() => {
                                   const newState = this.chooseRoutes()
                                   this.setState(newState)
                                   props.history.push("/")
                               }
                               }/>}/>
                        <Route exact path="/logout">
                            {authService.logout()}
                            <Redirect to="/"/>
                        </Route>
                        <Route exact path="/register" component={Registration}/>
                        {this.routesWithNavigation()}
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }

    homeRedirect(routes) {
        if (!authService.isUserAuthenticated())
            return "/login"
        if (routes.length > 0)
            return routes[0].path
        return "/not-found"
    }

    routesWithNavigation() {
        return (
            <Route>
                <Navigation routes={this.state.routes}/>
                <Switch>
                    <Route exact path="/">
                        <Redirect to={this.state.homeRedirect}/>
                    </Route>
                    {this.state.routes.map(r => <Route exact path={r.path} component={r.component} key={r.name}/>)}
                    <Redirect to="/not-found"/>
                </Switch>
            </Route>
        );
    }
}

export default App;
