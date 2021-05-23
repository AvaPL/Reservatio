import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {useHistory, useParams} from "react-router-dom";
import styles from "./bookingCalendar.module.scss";
import calendarStyle from "./Calender.scss";
import {Col, Container, Row, Dropdown, DropdownButton} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from 'react-calendar'
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import 'react-calendar/dist/Calendar.css';
import cn from "classnames";
import {authService} from "../auth/AuthService";
import {backendHost} from "../Config"
import {useFetch} from "../hooks/useFetch";
import {LocalDateTime, LocalTime, ChronoUnit, DateTimeFormatter, Instant} from "@js-joda/core";
import Modal from "react-bootstrap/Modal";
const RESERVATION_FORMAT_PATTERN = "HH:mm"
const RESERVATION_SLOT = 30; // In minutes

export default function BookingCalendarConsumer() {
    window.LocalDateTime = LocalDateTime;
    const {serviceproviderid, serviceid} = useParams();
    const history = useHistory();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableReservations, setAvailableReservations] = useState([])
    const [show, setShow] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState('');
    const handleSelectEmployee = (selectedEmployee) => {
        setSelectedEmployee(Employees.data?.find(e => e.id === Number(selectedEmployee)))
    }

    const handleAddReservation = (employeeId, serviceId, time) => {
        authService.fetchAuthenticated(`${backendHost}/rest/reservation/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                serviceId: serviceId,
                employeeId: employeeId,
                dateTime: time,
                customerId: authService.token?.entityId
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error("Failed to post");
            }
            setShow(true);
        })
    }

    const Employees = useFetch(() => fetchEmployees(serviceproviderid, serviceid));

    const ServiceProvider = useFetch(() => fetchServiceProvider(serviceproviderid));

    const Service = useFetch(() => fetchService(serviceproviderid, serviceid));

    useEffect(() => {
        if (!selectedEmployee || !selectedDate || !ServiceProvider.data) return;
        let utcTimestamp = Instant.parse(selectedDate.toISOString())
        const selectedLocalDate = LocalDateTime.ofInstant(utcTimestamp);

        const employeeReservations = selectedEmployee.reservations
            .map(res => ({...res, date: LocalDateTime.parse(res.dateTime)}))
            .filter(res => res.date.toLocalDate().equals(selectedLocalDate.toLocalDate()))
            .sort((l, r) => l.date.compareTo(r.date));

        const localOpenHour = LocalTime.parse(ServiceProvider.data.openHours);
        const localCloseHour = LocalTime.parse(ServiceProvider.data.closeHours);
        const selectedLocalOpenDateTime = LocalDateTime.ofDateAndTime(selectedLocalDate.toLocalDate(), localOpenHour).withNano(0);
        const selectedLocalCloseDateTime = LocalDateTime.ofDateAndTime(selectedLocalDate.toLocalDate(), localCloseHour).withNano(0).minusMinutes(Service.data.durationMinutes);

        const openingHoursInMinutes = selectedLocalOpenDateTime.until(selectedLocalCloseDateTime, ChronoUnit.MINUTES);

        const allReservationSlotsInDay = new Array(Math.floor(openingHoursInMinutes / RESERVATION_SLOT) + 1)
            .fill(undefined).map((_, idx) => selectedLocalOpenDateTime.plusMinutes(idx * RESERVATION_SLOT));

        const filteredReservationSlots = allReservationSlotsInDay.filter(slot => {
            while (employeeReservations.length !== 0 && employeeReservations[0].date.plusMinutes(employeeReservations[0].service.durationMinutes).compareTo(slot) <= 0)
                employeeReservations.shift();
            const firstReservation = employeeReservations?.[0];
            if (!firstReservation) return true;

            return slot.compareTo(firstReservation.date.plusMinutes(firstReservation.service.durationMinutes)) >= 0 ||
                slot.plusMinutes(RESERVATION_SLOT).compareTo(firstReservation.date) <= 0
        });

        setAvailableReservations(filteredReservationSlots);
    }, [selectedEmployee, selectedDate, ServiceProvider, Service])



    const fetchEmployees = (serviceProviderId, serviceId) => {
        const endpoint = `/rest/serviceProvider/${serviceProviderId}/employees/employeesByService/${serviceId}`;

        return authService.fetchAuthenticated(`${backendHost}${endpoint}`);
    }

    const fetchServiceProvider = (serviceProviderId) => {
        const endpoint = `/rest/serviceProvider/${serviceProviderId}`;

        return authService.fetchAuthenticated(`${backendHost}${endpoint}`);
    }

    const fetchService = (serviceProviderId, serviceId) => {
        const endpoint = `/rest/serviceProvider/${serviceProviderId}/services/${serviceId}`

        return authService.fetchAuthenticated(`${backendHost}${endpoint}`);
    }

    function closeModal() {
        history.push(`/booking/${serviceproviderid}`);
    }

    if (Employees.isLoading || ServiceProvider.isLoading || Service.isLoading) return null;

    return (
        <>
            <div className={styles.mainImgWrapper}>
                <img src={`http://localhost:9000/reservatio/serviceprovider${serviceproviderid}.jpg`} alt={ServiceProvider.data.name} className={styles.mainImg}/>
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
                            ${Service.data.name} $${Service.data.priceUsd}`}
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

                <Row className={styles.row}>
                    {availableReservations.map((reservation) => (
                        <Col sm={12} md={6} lg={4} className={cn(styles.marginBottom, styles.paddingTop)}
                             key={reservation.id}>
                            <AvailableService
                                localDateTime={reservation}
                                employeeId={selectedEmployee.id}
                                serviceId={serviceid}
                                handleAddReservation={handleAddReservation}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
            {show && <SuccessModal closeModal={closeModal}/>}

        </>
    );
}

function AvailableService({localDateTime, employeeId, serviceId, handleAddReservation}) {
    return (
        <Button
            className={cn(styles.button, styles.serviceCardPriceInfoCol)}
            variant="primary"
            onClick={() => handleAddReservation(employeeId, serviceId, localDateTime)}
        >
            {localDateTime.format(DateTimeFormatter.ofPattern(RESERVATION_FORMAT_PATTERN))}
        </Button>
    );
}

function SuccessModal({closeModal}) {
    const [counter, setCounter] = useState(5);

    useEffect(() => {
        if (counter === 0)  return closeModal();

        const t = window.setTimeout(() => {
            setCounter(s => s - 1);
        }, 1000);

        return () => window.clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter])

    return (
        <Modal show={true} onHide={closeModal}>
        <Modal.Header closeButton>
            <Modal.Title>Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Reservation accomplished!</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
                Close (You will be redirected in {counter}s)
            </Button>
        </Modal.Footer>
        </Modal>
    );
}
