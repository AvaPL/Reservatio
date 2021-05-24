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
import {authService} from "../auth/AuthService";
import {backendHost} from "../Config";

export default function Booking(){
  const { serviceproviderid } = useParams();
  const history = useHistory();

  const [state, setState] = useState({
    favourite: false,
    services: [],
    reviews: [],
    favourites: [],
    data : {},
    datafav : [],
    error : null,
  }
  );
  window.onload = function (){
    processBooking(fetchBooking(serviceproviderid));
    processFavourites(fetchFavourites(authService.token?.entityId));

    state.datafav.then (response => {
      for(let i = 0; i< response.length; i++){
        state.favourites.push(response[i].id);
        if(response[i].id === parseInt(serviceproviderid)){
          state.favourite = true;
        }
      }
    });

    state.data.then (response => {

      let counter = 0;
      let sumGrade = 0;
      for(let i = 0; i< response.reviews.length; i++){
        counter = counter + response.reviews[i].reservations.length
        for(let j = 0; j< response.reviews[i].reservations.length;j++){
          sumGrade = sumGrade + response.reviews[i].reservations[j].grade;
          state.reviews.push(response.reviews[i].reservations[j]);
        }
      }
      for(let i = 0; i < response.services.length; i++){
        state.services.push(response.services[i]);
      }
      setState((prevState) => ({
        ...prevState,
        name: response.name,
        address: "ul. " + response.street + " " + response.property_nr + ", " + response.city,
        score: (sumGrade/counter).toFixed(1),
        image: response.imageUrl,
      }));
    });
  };

  const processBooking = (data) => {
    console.log(data)
    state.data = data
  }

  const fetchBooking = (serviceproviderid) => {
    return authService.fetchAuthenticated(`${backendHost}/rest/bookingViews/${serviceproviderid}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch");
          }
          return response.json();
        })
        .catch(error => {
          console.log('error', error)
        })
  }

  const fetchFavourites = (customerId) => {
    return authService.fetchAuthenticated(`${backendHost}/rest/customers/${customerId}/favourites`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch");
          }
          return response.json();
        })
        .then(response => response._embedded.serviceProviders)
        .catch(error => {
          console.log('error', error)
        })
  }

  const processFavourites = (data) => {
    console.log(data)
    state.datafav = data
  }

  function changeFavourite() {
    setState((prevState) => ({
      ...prevState,
      favourite: !prevState.favourite,
    }));
    if (!state.favourite){
      console.log("Favourite to add: ");
      const customerId = authService.token?.entityId;
      authService.fetchAuthenticated(`${backendHost}/rest/addFavourite/${customerId}/${serviceproviderid}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (!response.ok) {
          throw new Error("Failed to post");
        }
        return response;
      })
          .then(() => console.log("Favourite added successfully"))
          .catch(error => {
            console.log("Error occurred: ", error);
          });
    }
    else if(state.favourite){
      console.log("Fav to delete: ");
      const customerId = authService.token?.entityId;
      authService.fetchAuthenticated(`${backendHost}/rest/deleteFavourite/${customerId}/${serviceproviderid}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then(response => {
        if (!response.ok) {
          throw response
        }
        return response;
      })
          .then(() => console.log(`Delete Fav`))
          .catch(error => {
            console.log("Error occurred: ", error);
          });
    }
  }

  return (
    <>{}
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
                priceUsd={service.price}
              />
            </Col>
          ))}
        </Row>
        {state.reviews.map((review) => (
            <ReviewCard name={review.first_name + " " + review.last_name} score={review.grade} review={review.message}/>
        ))}
      </Container>
    </>
  );
}

function ServiceCard({ name, priceUsd, serviceid, serviceproviderid }) {
  return (
    <Card body className={styles.marginBottom}>
      <Row>
        <Col xs={7} sm={6}>
          <Card.Title className={styles.serviceCardTitle}>{name}</Card.Title>
        </Col>
        <Col xs={5} sm={4} className={styles.serviceCardPriceInfoCol}>
            {priceUsd} $
            <Button
                className={styles.button}
                variant="primary"
                href={`/booking/${serviceproviderid}/${serviceid}`}
            >
              Book
            </Button>
        </Col>
      </Row>
    </Card>
  );
}

function ReviewCard({name, score, review }) {
  return (
    <Card body className={styles.marginBottom}>
      <Row>
        <Col xs={6} md={3}>
          <div className={styles.reviewCardImgWrapper}>
            <img src={"https://t3.ftcdn.net/jpg/01/65/63/94/360_F_165639425_kRh61s497pV7IOPAjwjme1btB8ICkV0L.jpg"} alt={name} className={styles.reviewCardImg} />
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
