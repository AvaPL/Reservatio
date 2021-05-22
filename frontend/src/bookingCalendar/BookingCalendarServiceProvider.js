import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {useHistory} from "react-router-dom";
import styles from "./bookingCalendar.module.scss";
import calendarStyle from "./Calender.scss";
import {Container, Dropdown, DropdownButton, Table} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from 'react-calendar'
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import 'react-calendar/dist/Calendar.css';
import {useFetch} from "../hooks/useFetch";
import {authService} from "../auth/AuthService";
import {backendHost} from "../Config";
import {Instant, LocalDateTime} from "@js-joda/core";

export default function BookingCalendarConsumer() {
    const history = useHistory();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [reservationsForEmployee, setReservationsForEmployee] = useState([])

    const Employees = useFetch(() => fetchEmployees(authService.token?.entityId));
    const ServiceProvider = useFetch(() => fetchServiceProvider(authService.token?.entityId));

    useEffect(() => {
        if (!selectedEmployee || !selectedDate || !ServiceProvider.data) return;
        let utcTimestamp = Instant.parse(selectedDate.toISOString())
        const selectedLocalDate = LocalDateTime.ofInstant(utcTimestamp);

        const employeeReservations = selectedEmployee.reservations
            .map(res => ({...res, dateTime: LocalDateTime.parse(res.dateTime)}))
            .filter(res => res.dateTime.toLocalDate().equals(selectedLocalDate.toLocalDate()))
            .sort((l, r) => l.dateTime.compareTo(r.dateTime));
        setReservationsForEmployee(employeeReservations);
    }, [selectedEmployee, selectedDate, ServiceProvider])

    console.log(reservationsForEmployee);
    console.log(Employees);

    const fetchServiceProvider = (serviceProviderId) => {
        const endpoint = '/rest/serviceProvider'

        return authService.fetchAuthenticated(`${backendHost}${endpoint}/${serviceProviderId}`);
    }

    const fetchEmployees = (serviceProviderId) => {

        const endpoint = '/rest/employeesByServiceProvider'

        return authService.fetchAuthenticated(`${backendHost}${endpoint}/${serviceProviderId}`);
    }

    const handleSelectEmployee = (selectedEmployee) => {
        setSelectedEmployee(Employees.data?.find(e => e.id === Number(selectedEmployee)));
    }

    if (Employees.isLoading || ServiceProvider.isLoading) return null;

    return (
        <>
            <div className={styles.mainImgWrapper}>
                <img src={`http://localhost:9000/reservatio/serviceprovider${authService.token?.entityId}.jpg`} alt={ServiceProvider.data.name} className={styles.mainImg} />
                {history.length > 0 && (
                    <div className={styles.mainBack}>
                        <Button
                            variant="outline-light"
                            onClick={() => history.goBack()}
                            className={styles.squareBox}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </Button>
                    </div>
                )}
            </div>
            <Container>
                <div className={styles.calendarTable} >
                    <div>
                        <label className={styles.rectangle}>
                            Services Calendar
                        </label>
                    </div>
                    <div>
                        <Calendar value={selectedDate}
                                  onChange={setSelectedDate}
                                  className={[Calendar.css, calendarStyle.reactCalendar]}
                        />
                    </div>
                    <DropdownButton className={styles.dropdownButton}
                                title={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : "Choose an employee"}
                                onSelect={handleSelectEmployee}
                                isexpanded={true}>
                    {Employees.data.map((employee) => (
                        <Dropdown.Item key={employee.id}
                                       eventKey={employee.id}>{`${employee.firstName} ${employee.lastName}`}</Dropdown.Item>
                    ))}
                    </DropdownButton>
                </div>
                <Table className={styles.timeTable}>
                    <thead>
                    <tr bgcolor={`#F85F6A`}>
                        <th className={styles.timeTableRow}>Time</th>
                        <th className={styles.timeTableRow}>Service</th>
                    </tr>
                    </thead>
                    <tbody>
                        {reservationsForEmployee?.map(reservation => (
                            <tr key={reservation.id}>
                                <td className={styles.timeTableRow}>
                                    {reservation.dateTime.toString().slice(11, 16)}
                                </td>
                                <td className={styles.timeTableRow}>
                                    {reservation.service? reservation.service.name : "No services"} Duration: {reservation.service ? reservation.service.durationMinutes : ""} Price: {reservation.service? reservation.service.priceUsd : ""}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}
