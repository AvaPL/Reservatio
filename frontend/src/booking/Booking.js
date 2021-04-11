import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { useParams, useHistory } from "react-router-dom";
import styles from "./booking.module.scss";
import { Container, Row, Col, Card } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faStar as fasStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import cn from "classnames";

export default function Booking() {
  const { serviceproviderid } = useParams();
  const history = useHistory();

  const [state, setState] = useState({
    image: "https://source.unsplash.com/1600x900/?barber",
    favourite: true,
    score: 0,
    name: "Nazwa salonu",
    address: "ul. Owaka 4, Wrocław",
    services: [
      {
        id: 1,
        name: "Strzyżenie damskie",
        price: 60,
      },
      {
        id: 2,
        name: "Strzyżenie męskie",
        price: 20,
      },
    ],
    reviews: [
      {
        id: 123,
        image: "https://source.unsplash.com/600x600/?person",
        name: "Name",
        review: "Ala ma kota i nie ma psa. Tola ma lisa.",
        score: 3,
      },
      {
        id: 124,
        image: "https://source.unsplash.com/600x600/?man,woman",
        name: "XDD",
        review: "Trololol super fryzjer.",
        score: 2,
      },
    ],
  });

  function changeFavourite() {
    // Jakis call do API
    setState((prevState) => ({
      ...prevState,
      favourite: !prevState.favourite,
    }));
  }

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
        <div className={styles.mainStar}>
          <button
            className={cn(styles.mainStarButton, styles.squareBox)}
            onClick={changeFavourite}
          >
            <FontAwesomeIcon icon={state.favourite ? fasStar : farStar} />
          </button>
        </div>
        <div className={styles.mainScore}>
          <Button variant="outline-light" className={styles.squareBox}>
            {state.score}
          </Button>
        </div>
      </div>
      <Container className={styles.booking}>
        <Row>
          <Col className={cn(styles.marginBottom, styles.paddingTop)}>
            <h1>{state.name}</h1>
            <span>{state.address}</span>
          </Col>
        </Row>
        <Row>
          {state.services.map((service) => (
            <Col sm={12} md={6} lg={4} key={service.id}>
              <ServiceCard
                {...service}
                serviceproviderid={serviceproviderid}
                serviceid={service.id}
              />
            </Col>
          ))}
        </Row>
        {state.reviews.map((review) => (
          <ReviewCard key={review.id} {...review} />
        ))}
      </Container>
    </>
  );
}

function ServiceCard({ name, price, serviceid, serviceproviderid }) {
  return (
    <Card body className={styles.marginBottom}>
      <Row>
        <Col xs={7} sm={6}>
          <Card.Title className={styles.serviceCardTitle}>{name}</Card.Title>
        </Col>
        <Col xs={5} sm={6} className={styles.serviceCardPriceInfoCol}>
          <Button
              className={styles.button}
              variant="primary"
              href={`/booking/${serviceproviderid}/${serviceid}`}
          >
            {price} zł
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

function ReviewCard({ image, name, score, review }) {
  return (
    <Card body className={styles.marginBottom}>
      <Row>
        <Col xs={6} md={3}>
          <div className={styles.reviewCardImgWrapper}>
            <img src={image} alt={name} className={styles.reviewCardImg} />
          </div>
        </Col>
        <Col xs={6} md={9} className={styles.serviceCardInfoColumn}>
          <Row>
            <Col xs={12} lg={9}>
              <h4>{name}</h4>
            </Col>
            <Col xs={12} lg={3}>
              <StarRatings
                starDimension="1rem"
                rating={score}
                starRatedColor="#F85F6A"
                numberOfStars={5}
                name="rating"
              />
            </Col>
          </Row>
          {review}
        </Col>
      </Row>
    </Card>
  );
}
