import './App.scss';
import {Navigation} from "./navigation/Navigation";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import Appointments from "./customer/appointments/Appointments";
import Explore from "./customer/explore/Explore";
import Favorites from "./customer/favorites/Favorites";
import PageNotFound from "./pagenotfound/PageNotFound";
import Login from "./login/Login";
import Registration from "./registration/Registration";
import Employees from "./serviceprovider/employees/Employees";
import Profile from "./serviceprovider/profile/Profile";
import Services from "./serviceprovider/services/Services";
import Statistics from "./serviceprovider/statistics/Statistics";
import {Component} from "react";
import Booking from "./booking/Booking";
import BookingCalendarServiceProvider from "./bookingCalendar/BookingCalendarServiceProvider";
import BookingCalendarConsumer from "./bookingCalendar/BookingCalendarConsumer";
import ServiceProviderDetails from "./customer/serviceProviderDetails/ServiceProviderDetails";
import {authService} from "./auth/AuthService";
import Unauthorized from "./unauthorized/Unauthorized";
import Logout from "./logout/Logout";

const routes = [
    {name: "Explore", path: "/explore", component: Explore, requiredRole: "customer"},
    {name: "Favorites", path: "/favorites", component: Favorites, requiredRole: "customer"},
    {name: "Appointments", path: "/appointments", component: Appointments, requiredRole: "customer"},
    {name: "Statistics", path: "/statistics", component: Statistics, requiredRole: "service_provider"},
    {name: "Services", path: "/services", component: Services, requiredRole: "service_provider"},
    {name: "Employees", path: "/employees", component: Employees, requiredRole: "service_provider"},
    {name: "Profile", path: "/profile", component: Profile, requiredRole: "service_provider"}
]

class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = this.chooseRoutes()
    }

    chooseRoutes() {
        const accessibleRoutes = routes.filter(r => authService.userHasRole(r.requiredRole))
        const inaccessibleRoutes = routes.filter(r => !authService.userHasRole(r.requiredRole))
        const homeRedirect = this.homeRedirect(accessibleRoutes)
        const inaccessibleRouteRedirect = this.inaccessibleRouteRedirect()
        return {
            accessibleRoutes: accessibleRoutes,
            inaccessibleRoutes: inaccessibleRoutes,
            homeRedirect: homeRedirect,
            inaccessibleRouteRedirect: inaccessibleRouteRedirect
        }
    }

    homeRedirect(accessibleRoutes) {
        if (!authService.isUserAuthenticated())
            return "/login"
        if (accessibleRoutes.length > 0)
            return accessibleRoutes[0].path
        return "/unauthorized"
    }

    inaccessibleRouteRedirect() {
        if (!authService.isUserAuthenticated())
            return "/login"
        return "/unauthorized"
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/not-found" component={PageNotFound}/>
                        <Route exact path="/unauthorized" component={Unauthorized}/>
                        <Route exact path="/login" render={props => this.renderLogin(props)}/>
                        <Route exact path="/logout" render={props => this.renderLogout(props)}/>
                        <Route exact path="/register" render={props => this.renderRegister(props)}/>
                        {/* TODO: Paths below should have a hierarchy originating from navbar routes */}
                        <Route exact path="/booking/:serviceproviderid/:serviceid" component={BookingCalendarConsumer}/>
                        <Route exact path="/calendar" component={BookingCalendarServiceProvider}/>
                        <Route exact path="/booking/:serviceproviderid" component={Booking}/>
                        <Route exact path="/serviceproviderdetails" component={ServiceProviderDetails}/>
                        {this.routesWithNavigation()}
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }

    renderLogin(props) {
        if (authService.isUserAuthenticated())
            return <Redirect {...props} to="/"/>
        return <Login {...props} onLogin={() => {
            const newState = this.chooseRoutes()
            this.setState(newState)
            props.history.push("/")
        }
        }/>;
    }

    renderLogout(props) {
        return <Logout {...props} onLogout={() => {
            const newState = this.chooseRoutes()
            this.setState(newState)
            props.history.push("/")
        }
        }/>
    }

    renderRegister(props) {
        if (authService.isUserAuthenticated())
            return <Redirect {...props} to="/"/>
        return <Registration {...props}/>
    }

    routesWithNavigation() {
        return (
            <Route>
                <Navigation routes={this.state.accessibleRoutes}/>
                <Switch>
                    <Route exact path="/">
                        <Redirect to={this.state.homeRedirect}/>
                    </Route>
                    {this.accessibleRoutes()}
                    {this.inaccessibleRoutes()}
                    <Redirect to="/not-found"/>
                </Switch>
            </Route>
        );
    }

    accessibleRoutes() {
        return this.state.accessibleRoutes.map(r =>
            <Route exact path={r.path} component={r.component} key={r.name}/>
        );
    }

    inaccessibleRoutes() {
        return this.state.inaccessibleRoutes.map(r =>
            <Route exact path={r.path} key={r.name}>
                <Redirect to={this.state.inaccessibleRouteRedirect}/>
            </Route>
        );
    }
}

export default App;
