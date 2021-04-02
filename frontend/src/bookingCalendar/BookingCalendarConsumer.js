import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import {useHistory, useParams} from "react-router-dom";
import styles from "./bookingCalendar.module.scss";
import {Card, Col, Container, Row} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from 'react-calendar'
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import 'react-calendar/dist/Calendar.css';
import cn from "classnames";

export default function BookingCalendarConsumer() {
    const { serviceproviderid, serviceid } = useParams();
    const history = useHistory();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [state, setState] = useState({
        image: "https://source.unsplash.com/1600x900/?barber",
        favourite: true,
        score: 0,
        name: "Nazwa salonu",
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
            <Container className={styles.calendarTable}>
                <Calendar value={selectedDate}
                          onChange={setSelectedDate}
                          className={cn(styles.calendarStyle, Calendar.css)}
                />
                <Row>
                    {state.terms.filter(term => term.date.getTime() === selectedDate.getTime() && term.available === 1).map((term) => (
                        <Col sm={12} md={6} lg={4} key={term.id}>
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
        <Card body className={styles.marginBottom}>
            <Row>
                <Col xs={5} sm={6} className={styles.serviceCardPriceInfoCol}>
                    <Button
                        variant="primary"
                        // strzał do API (rezerwacja)
                    >
                        {time}
                    </Button>
                </Col>
            </Row>
        </Card>
    );
}