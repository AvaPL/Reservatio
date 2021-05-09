import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import {useHistory, useParams} from "react-router-dom";
import styles from "./bookingCalendar.module.scss";
import {Col, Container, Row} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from 'react-calendar'
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import 'react-calendar/dist/Calendar.css';
import cn from "classnames";

export default function BookingCalendarConsumer() {
    const { serviceproviderid, serviceid } = useParams();
    const history = useHistory();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [state] = useState({
        image: "https://source.unsplash.com/1600x900/?barber",
        favourite: true,
        score: 0,
        name: "Nazwa salonu",
        serviceName: "Strzyżenie",
        price: "60$",
        address: "ul. Owaka 4, Wrocław",
        terms: [
            {
                id: 1,
                time: "8:00",
                date: new Date(2021, 3, 10),
                available: 1,
            },
            {
                id: 2,
                time: "8:45",
                date: new Date(2021, 3, 10),
                available: 0,
            },
            {
                id: 3,
                time: "9:30",
                date: new Date(2021, 3, 10),
                available: 1,
            },
            {
                id: 4,
                time: "10:15",
                date: new Date(2021, 3, 11),
                available: 1,
            },
            {
                id: 5,
                time: "11:00",
                date: new Date(2021, 3, 11),
                available: 1,
            },
            {
                id: 6,
                time: "11:45",
                date: new Date(2021, 3, 11),
                available: 1,
            },
            {
                id: 7,
                time: "12:30",
                date: new Date(2021, 3, 11),
                available: 1,
            },
            {
                id: 8,
                time: "14:45",
                date: new Date(2021, 3, 11),
                available: 1,
            },
            {
                id: 9,
                time: "15:30",
                date: new Date(2021, 3, 11),
                available: 1,
            },
            {
                id: 10,
                time: "16:15",
                date: new Date(2021, 3, 11),
                available: 1,
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
                                {`${state.serviceName}
                        ${state.name} ${state.price}`}
                        </label>
                    </div>
                    <div>
                        <Calendar value={selectedDate}
                                  onChange={setSelectedDate}
                                  className={cn(Calendar.css, styles.calendarStyle)}
                        />
                    </div>
                </div>
                <Row className={styles.row}>
                    {state.terms.filter(term => term.date.getTime() === selectedDate.getTime() && term.available === 1).map((term) => (
                        <Col sm={12} md={6} lg={4} className={cn(styles.marginBottom, styles.paddingTop)} key={term.id}>
                            <AvailableService
                                {...term}
                                serviceproviderid={serviceproviderid}
                                serviceid={serviceid}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

function AvailableService({ time, serviceid, serviceproviderid }) {
    return (
                <Button
                    className={cn(styles.button, styles.serviceCardPriceInfoCol)}
                    variant="primary"
                    // strzał do API (rezerwacja)
                >
                    {time}
                </Button>
    );
}