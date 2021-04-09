import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import {useHistory, useParams} from "react-router-dom";
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
    const [state, setState] = useState({
        image: "https://source.unsplash.com/1600x900/?barber",
        favourite: true,
        score: 0,
        calendarHeader: "Zestawienie rezerwacji",
        address: "ul. Owaka 4, Wrocław",
        terms: [
            {
                id: 1,
                time: "8:00",
                date: new Date(2021, 3, 10),
                available: "Wolne",
            },
            {
                id: 2,
                time: "8:45",
                date: new Date(2021, 3, 10),
                available: "Strzyżenie męskie",
            },
            {
                id: 3,
                time: "9:30",
                date: new Date(2021, 3, 10),
                available: "Wolne",
            },
            {
                id: 4,
                time: "10:15",
                date: new Date(2021, 3, 11),
                available: "Wolne",
            },
            {
                id: 5,
                time: "11:00",
                date: new Date(2021, 3, 11),
                available: "Włosy klasycznie + broda",
            },
            {
                id: 6,
                time: "11:45",
                date: new Date(2021, 3, 11),
                available: "Strzyżenie damskie",
            },
            {
                id: 7,
                time: "12:30",
                date: new Date(2021, 3, 11),
                available: "Wolne",
            },
            {
                id: 8,
                time: "14:45",
                date: new Date(2021, 3, 11),
                available: "Wolne",
            },
            {
                id: 9,
                time: "15:30",
                date: new Date(2021, 3, 11),
                available: "Wolne",
            },
            {
                id: 10,
                time: "16:15",
                date: new Date(2021, 3, 11),
                available: "Wolne",
            },
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
                    <th className={styles.timeTableRow}>Czas</th>
                    <th className={styles.timeTableRow}>Dostępność</th>
                    </thead>
                    <tbody>
                        {state.terms.filter(term => term.date.getTime() === selectedDate.getTime()).map((term) => (
                            <tr key={term.id}>
                                <td className={styles.timeTableRow}>
                                    {term.time}
                                </td>
                                <td className={styles.timeTableRow}>
                                    {term.available}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}