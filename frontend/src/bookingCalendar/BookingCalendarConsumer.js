import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {useHistory, useParams} from "react-router-dom";
import styles from "./bookingCalendar.module.scss";
import {Col, Container, Row, Dropdown, DropdownButton} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from 'react-calendar'
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import 'react-calendar/dist/Calendar.css';
import cn from "classnames";
import {authService} from "../auth/AuthService";
import {backendHost} from "../Config"
import {useFetch} from "../hooks/useFetch";

export default function BookingCalendarConsumer() {
    const {serviceproviderid, serviceid} = useParams();
    const history = useHistory();
    const [selectedDate, setSelectedDate] = useState(new Date());
    // const [state] = useState({
    //     image: "https://source.unsplash.com/1600x900/?barber",
    //     favourite: true,
    //     score: 0,
    //     name: "Nazwa salonu",
    //     serviceName: "Strzyżenie",
    //     price: "60$",
    //     address: "ul. Owaka 4, Wrocław",
    //     availableReservations: [
    //         {
    //             id: 1,
    //             time: "8:00",
    //             date: new Date(2021, 3, 10),
    //             consumerId: 1,
    //             employeeid: 1,
    //         },
    //         {
    //             id: 2,
    //             time: "8:45",
    //             date: new Date(2021, 3, 10),
    //             consumerId: null,
    //             employeeid: 1,
    //         },
    //         {
    //             id: 3,
    //             time: "9:30",
    //             date: new Date(2021, 3, 10),
    //             consumerId: null,
    //             employeeid: 2,
    //
    //         },
    //         {
    //             id: 4,
    //             time: "10:15",
    //             date: new Date(2021, 3, 11),
    //             consumerId: null,
    //             employeeid: 2,
    //         },
    //         {
    //             id: 5,
    //             time: "11:00",
    //             date: new Date(2021, 3, 11),
    //             consumerId: null,
    //             employeeid: 2,
    //         },
    //         {
    //             id: 6,
    //             time: "11:45",
    //             date: new Date(2021, 3, 11),
    //             consumerId: null,
    //             employeeid: 1,
    //         },
    //         {
    //             id: 7,
    //             time: "12:30",
    //             date: new Date(2021, 3, 11),
    //             consumerId: null,
    //             employeeid: 1,
    //         },
    //         {
    //             id: 8,
    //             time: "14:45",
    //             date: new Date(2021, 3, 11),
    //             consumerId: null,
    //             employeeid: 2,
    //         },
    //         {
    //             id: 9,
    //             time: "15:30",
    //             date: new Date(2021, 3, 11),
    //             consumerId: null,
    //             employeeid: 1,
    //         },
    //         {
    //             id: 10,
    //             time: "16:15",
    //             date: new Date(2021, 3, 11),
    //             consumerId: null,
    //             employeeid: 2,
    //         },
    //     ],
    //     employees: [],
    // });

    const [value, setValue] = useState('');
    const handleSelect = (selectedEmployee) => {
        console.log(selectedEmployee);
        setValue(selectedEmployee)
    }

    const handleClick = (employeeid, serviceid) => {
        authService.fetchAuthenticated(`${backendHost}/rest/reservation/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                serviceId: serviceid,
                employeeId: employeeid,
                customerId: authService.token?.entityId
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error("Failed to post");
            }
            return response;
        })
    }

    // let [employees, setEmployees] = useState([]);
    // window.onload = () => {
    //     fetchEmployees(serviceid);
    //     console.log(employees);
    // };

    const Employees = useFetch(() => fetchEmployees(serviceid));
    const ServiceProvider = useFetch(() => fetchServiceProvider(serviceproviderid));
    const Service = useFetch(() => fetchService(serviceid));

    const fetchEmployees = (serviceId) => {

        const endpoint = '/rest/employeesByService'

        return authService.fetchAuthenticated(`${backendHost}${endpoint}/${serviceId}`);
    }

    const fetchServiceProvider = (serviceProviderId) => {
        const endpoint = '/rest/serviceProvider'

        return authService.fetchAuthenticated(`${backendHost}${endpoint}/${serviceProviderId}`);
    }

    const fetchService = (serviceId) => {
        const endpoint = '/rest/service'

        return authService.fetchAuthenticated(`${backendHost}${endpoint}/${serviceId}`);
    }

    if (Employees.isLoading || ServiceProvider.isLoading || Service.isLoading) return null;

    debugger;
    return (
        <>
            <div className={styles.mainImgWrapper}>
                <img src={ServiceProvider.data.imageUrl} alt={ServiceProvider.data.name} className={styles.mainImg}/>
                {history.length > 0 && (
                    <div className={styles.mainBack}>
                        <Button
                            variant="outline-light"
                            onClick={() => history.goBack()}
                            className={styles.squareBox}
                        >
                            <FontAwesomeIcon icon={faChevronLeft}/>
                        </Button>
                    </div>
                )}
            </div>
            <Container>
                <div className={styles.calendarTable}>
                    <div>
                        <label className={styles.rectangle}>
                            {`${ServiceProvider.data.name} 
                            ${Service.data.name} ${Service.data.price_usd}`}
                        </label>
                    </div>
                    <div>
                        <Calendar value={selectedDate}
                                  onChange={setSelectedDate}
                                  className={cn(Calendar.css, styles.calendarStyle)}
                        />
                    </div>
                    <DropdownButton className={styles.dropdownButton} title="Wybierz pracownika" onSelect={handleSelect}
                                    isExpanded={true}>
                        {Employees.data.map((employee) => (
                            <Dropdown.Item
                                eventKey={employee.id}>{`${employee.first_name} ${employee.last_name}`}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                </div>

                <Row className={styles.row}>
                    {/*{state.availableReservations.filter(reservation => reservation.date.getTime() === selectedDate.getTime() && reservation.consumerId === null && reservation.employeeid == value).map((reservation) => (*/}
                    {/*    <Col sm={12} md={6} lg={4} className={cn(styles.marginBottom, styles.paddingTop)}*/}
                    {/*         key={reservation.id}>*/}
                    {/*        <AvailableService*/}
                    {/*            {...reservation}*/}
                    {/*            time={reservation.time}*/}
                    {/*            employeeid={reservation.employeeid}*/}
                    {/*            serviceid={reservation.id}*/}
                    {/*        />*/}
                    {/*    </Col>*/}
                    {/*))}*/}
                </Row>
            </Container>
        </>
    );

    function AvailableService({time, employeeid, serviceid}) {
        return (
            <Button
                className={cn(styles.button, styles.serviceCardPriceInfoCol)}
                variant="primary"
                onClick={() => handleClick(employeeid, serviceid)}
            >
                {time}
            </Button>
        );
    }
}
