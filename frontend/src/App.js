import './App.scss';
import {Navigation} from "./navigation/Navigation";
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
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
import Booking from "./booking/Booking";
import BookingCalendarServiceProvider from "./bookingCalendar/BookingCalendarServiceProvider";
import BookingCalendarConsumer from "./bookingCalendar/BookingCalendarConsumer";
import ServiceProviderDetails from "./customer/serviceProviderDetails/ServiceProviderDetails";

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
                        <Route exact path="/register" component={Registration}/>
                        <Route exact path="/customer/booking/:serviceproviderid" component={Booking}/>
                        <Route exact path="/customer/booking/:serviceproviderid/:serviceid" component={BookingCalendarConsumer}/>
                        <Route exact path="/serviceProvider/:serviceproviderid/calendar" component={BookingCalendarServiceProvider}/>
                        <Route exact path="/customer/serviceproviderdetails" component={ServiceProviderDetails}/>
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
            {name: "Explore", path: "/customer/explore", component: Explore},
            {name: "Favorites", path: "/customer/favorites", component: Favorites},
            {name: "Search", path: "/customer/search", component: Search},
            {name: "Appointments", path: "/customer/appointments", component: Appointments}
        ]
        return this.routesWithNavigation("/customer", routes)
    }

    routesWithNavigation(basePath, routes) {
        return (
            <Route>
                <Navigation routes={routes}/>
                <Switch>
                    <Route exact path={basePath}><Redirect to={routes[0].path}/></Route>
                    {routes.map(r => <Route exact path={r.path} component={r.component} key={r.name}/>)}
                    <Redirect to="/not-found"/>
                </Switch>
            </Route>
        );
    }


    serviceProviderRoutes() {
        const routes = [
            {name: "Statistics", path: "/serviceProvider/statistics", component: Statistics},
            {name: "Services", path: "/serviceProvider/services", component: Services},
            {name: "Employees", path: "/serviceProvider/employees", component: Employees},
            {name: "Profile", path: "/serviceProvider/profile", component: Profile}
        ]
        return this.routesWithNavigation("/serviceProvider", routes)
    }
}

export default App;
