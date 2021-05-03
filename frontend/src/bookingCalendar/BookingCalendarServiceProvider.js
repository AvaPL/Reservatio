import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import {useHistory} from "react-router-dom";
import styles from "./bookingCalendar.module.scss";
import {Container, Table} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from 'react-calendar'
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import 'react-calendar/dist/Calendar.css';
import cn from "classnames";

export default function BookingCalendarConsumer() {
    const history = useHistory();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [state] = useState({
        image: "https://source.unsplash.com/1600x900/?barber",
        favourite: true,
        score: 0,
        calendarHeader: "Zestawienie rezerwacji",
        address: "ul. Owaka 4, Wrocław",
        reservations: [
            {
                id: 1,
                time: "8:00",
                date: new Date(2021, 3, 10),
                available: "Wolne",
                employeeId: 1,
            },
            {
                id: 2,
                time: "8:45",
                date: new Date(2021, 3, 10),
                available: "Strzyżenie męskie",
                employeeId: 1,
            },
            {
                id: 3,
                time: "9:30",
                date: new Date(2021, 3, 10),
                available: "Wolne",
                employeeId: 1,
            },
            {
                id: 4,
                time: "10:15",
                date: new Date(2021, 3, 11),
                available: "Wolne",
                employeeId: 1,
            },
            {
                id: 5,
                time: "11:00",
                date: new Date(2021, 3, 11),
                available: "Włosy klasycznie + broda",
                employeeId: 2,
            },
            {
                id: 6,
                time: "11:45",
                date: new Date(2021, 3, 11),
                available: "Strzyżenie damskie",
                employeeId: 2,
            },
            {
                id: 7,
                time: "12:30",
                date: new Date(2021, 3, 11),
                available: "Wolne",
                employeeId: 2,
            },
            {
                id: 8,
                time: "14:45",
                date: new Date(2021, 3, 11),
                available: "Wolne",
                employeeId: 2,
            },
            {
                id: 9,
                time: "15:30",
                date: new Date(2021, 3, 11),
                available: "Wolne",
                employeeId: 1,
            },
            {
                id: 10,
                time: "16:15",
                date: new Date(2021, 3, 11),
                available: "Wolne",
                employeeId: 2,
            },
        ],
        employees: [
            {
                id: 1,
                firstName: "Mario",
                lastName: "Luigi",
            },
            {
                id: 1,
                firstName: "Ash",
                lastName: "Ketchum",
            }
        ],
    });

    return (
        <>
            <div className={styles.mainImgWrapper}>
                <img src={state.image} alt={state.name} className={styles.mainImg} />
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
                            {`${state.calendarHeader}`}
                        </label>
                    </div>
                    <div>
                        <Calendar value={selectedDate}
                                  onChange={setSelectedDate}
                                  className={cn(Calendar.css, styles.calendarStyle)}
                        />
                    </div>
                </div>
                <Table className={styles.timeTable}>
                    <thead>
                    <tr>
                        <th className={styles.timeTableRow}>Czas</th>
                        <th className={styles.timeTableRow}>Dostępność</th>
                    </tr>
                    </thead>
                    <tbody>
                        {state.reservations.filter(reservation => reservation.date.getTime() === selectedDate.getTime()).map(reservation => (
                            <tr key={reservation.id}>
                                <td className={styles.timeTableRow}>
                                    {reservation.time}
                                </td>
                                <td className={styles.timeTableRow}>
                                    {reservation.available}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}