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
        image: `http://localhost:9000/reservatio/serviceprovider${serviceproviderid}.jpg`,
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
            <img src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAMAAAAt85rTAAAAYFBMVEX////e3t6vr697e3t+fn7Q0NCsrKx3d3e8vLy3t7fOzs7AwMC2traxsbHS0tLFxcXo6Ojv7+/09PTz8/Pd3d2enp7q6upxcXGUlJSDg4OLi4uPj4+np6eNjY2goKBra2uLzSdZAAAM6ElEQVR4nO2dibKiOhCGwUSCoCFsEXC57/+WtzsbAdTRqfGIp/JXTQ2iePqzO93ZxCgKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCvoG1RJUV582422qGg5qmjgWovyNmJJP1DSA+as4Yz7XdgucMUTt7wBdAvqcQsryu9unboJ3ITVmo9rnd3LWj/icLxHTtM9PG/yqSmX+s8pQ/KvykHyFT0l9IhmXn7b8STlAztE7L3B+iQ+FtVdCVZBxw3UYOtIJcvZ9gFWjeTJrb1XVJXJy0+Du6lsAubG3mdpblVII8Qi0+ZDFL6q25sc3n0Z3SikazheA4oct/UvV2UNAKwUqYp/zS7Jo/ZJDIHCbLwMsixcjTljA8q12/TOJVx0Sm0+E12+165+p0fYW2ycdUjUW8DuqRMQLUFYUz9pbqgtAX1IlKnDeS/YK8/ricdZdjeriRXtje8GXlMHyVcDGXvAlSVS+6hDbBLMvyTHxqw5xgG8169/J2ftsVcu+DNDa+3SVcBe8165/pap4wV4JH4KwF3xJGbQ5Jn+io8YRKn7hgs+qkphWRG40sfdGuNa8yHMoJdxe8ENm/p2qUsRxjIUhtvZ6SbTk28UFDeDlxXcA1lIgXtwgYGPtHZOoyPJ81sDEFvlyrJWZeX3xs0Y/KweH/zAqrUMKG5UqFFUwOkmNt3rASiq2URK72sZe2y+JLYtrk6ULyhw6A5V5Pl9E8adVzehAJfZEjb26SpRbB2OIS17k/jmXlFZXJcoFX6yqmjY3VT1RkY0wqUKG59PxVOO12dWNJWRzC9Am0VSqWEw9wLSpxeRMnsY3k9JKtABUSTROtaAMVpk9tv8X9sgKruDmBfnqxhKLEFVJtLEwpTt8IKkBUcXqAOt47kIs7c7eOsruYU0A7atWOBpcZNE6GsMSBkvFH/nAa7V91QrHEvIGYOnsrSLV4HYP+HZQ+qRtliuccVo0Qggyme6UsACYwwfCKmEvWF2VgHCc8Qksg7vR3j/y7Wtss/p4lYOlZUctEnsHWP0ZsII2aw6L1ZXBaN4IG0yisQGEfoncox4SKsC9BlxfEl00QlUl9lo4pRbDmCHdIeT+lnb7FAAL82iVM06z7jZWCWuvjjhctI4bnhnQucBrZW6OV1glojFGGwdo7c387UuVGjPyLWIeDgcHuMWenTle3VhCqZ4n0dI6Ki2yjMfTzKgX5yFwNecBvcbNBbsVlsFoVihUlVAeOhy0nyDX5EWRNfF0jruWolFxix01/eJDutJ1CT+PqgkZQzcRkqZFwWfb7ipspoV5zVpnnPw8ivG4XeKNnDsYL6ltd3LkzFcO6DdCDLJi84DQ+TMv1H5RCS5MzdkVzjgpVW5GTQPmD9lG4ecADs0KG9GrLIMorxFildht/uxCB4myD9ZZJaJJI8SxhLb6dR1WOJbQGgsFVon48LwDjRdNxK6xJ6rlemvoA/6XDtwcPo1xXzZG1YxTtvnLGN1/GuO+Ki/HREXyGley0Rck6acx7msCmCfOZouQPMGcJKutEtFYKDBNFAkKIa3Go4dabZWIRhcioNifUc9BedqstkqgxiQa4dAPx/H7w5OeM1pxlYhcoZgOcNU4frd/knO/asBy7GtPpRZ/myzfbZLHcXtea1dbyzZCcec7czCQL0VcpPskOd9uouc1J9HZ1JMQQt75NllVCojbHOPW54T/z+uccXJarFEoTHnn22SQhvg2g0S0GR266iQ6m3qacgLmHc5axk0DDXS/OScrXDmbaL5GMZN8ZL7aQLRyvlvbLTwnft/3O5e6sd/CROgaV1T+Qrdi9G4y/UotXfeL4FCTRvgrWt1M9RiYvw9OSfyahHlP9ZffvCEoKCgoKCgoKCgoKCgoKCgoKCgoKOgXqcgy98UinhXedyEEzzIuFjPaePNGs62gnNySUeJbjdfX/Mb9GiuB98njjVm2r73bPL5rJf8/xo47c9yxo9vT0my6nrD+dJ1vAilbxlp9yBnoYp/YHeGtxv31DYEn28kaaVVcT/CmjAyd/pNxz6zIu3bmHymlvfn0OsIsTtoTgqYQQtvpBWVLyFUfcriWEuu0gcCDce/rjuCzvl/ijhIjdtZnBupOvWu7EAJag0fAhFEybLJsA1azdhKmC0CzG7RRDxxg3RIK7+eZzSmBN+02h8O5GzILSFrzVZp3bUk80r4nA58CZkf4w+r7RgLsJJMtyR5gTuhlIMbDO9KfvJcKQroc/rnr1AdwMF9iMlvDAJC9e6PXkZ7OQKPaigUsT4ScTHCJE6GD/+l6gDtCkpYM6pV1xzp47OI5ZySJGWV2k1vVkSVMPJD3A5JTDE5SYBYwh1hzfxceMD8BeIApmLchVL206UnC2egxfK+qp65Rb4FvsTn9RwAprfeM0ioaAc+jA8GF0E6uXjL0AM9gXkHJGa+F9+AeYAlBXuIb2RNw1bCoBD8TokzW4LEkcoCyI9poLYitwSuPHuAVAONefRhwDa2zERAiFHJTAZ+cjlGIdJIsaip4kKRVDSrftucGAaMdUwndAMaXSV5JyCTbTwAhkiHPQoqKoR1HAHgxba4lDLKr6KkO4KhBFHVUC6XaAp6uSskbAUUkLuAzB8h7SryvOhwIvuQGYNWSfotxukePQaxljBpA2StsfK2ueFlvg5FfTqBLoQFtHWSntwJCwieQKg1gMwXc3wMsO9JzdBsEIzizgkRiPZhR0mFYp+AhOQOE3gMlOm95hf7NgCU2O4wrBBRQzzbjK65Q7W62wVoBVgxbMUNPQSYddKFLILvgnW8T6Capuzk1g+0RNG3b9tQCjn2n9wLCR077eDcmmdZt0q4gPXT+XdQcoFSA6HfIn3glAqqSKTp0EvYwqSkOmGRcLobYHgF/IIuq+AMz94n5PCGt9K62Q4tk/pePRsD4Qi6xSpiHDemlB4itGPmOQGg+q9Z7T3D9zwM2RzqYEI0K6sUoJlF/17UHeFIVQkBxGJR7XIhC07vEJajGq80p6ro5HwFUbrMdD/i4be8F+pt+UfQBIfUjIASc6flgZOL/ukXr17gOOORVdtZB6gH+SKHXgBKHOwYQqjc9boQsBdQIcpn0QEbATNd4TLMqVh2g6/sBPVS6Tn0+vMfBRAGOlfw0epDsdV0U77ohiwNEX7muIwda0kO6Q6OmXwsYAbe9zj4QmeSKENIA5gz7aVpneAf9B7IBTjPatl1P6Vgm+kGpP79pN9yRHg0gJk+XtJuW6QLMrrMeJALqxoTFDmMOM6SyFzyoDjqvrHGoImbEKA6MmbJupg5iNUjWp9o3ddZY74bkRd/TsSo1h64frss72pVXSrUHYZyhrcrbs3qZhAIHCbcmPR2/EwnjTUdbFYd26Ntzam6gG596K3oN+xmDgoKCgoKCgv6s2v7AAMhbDmvwl2y8nhv+MIM9djfrr3I4rNxZfWvfuuHqVxz4Sn6CUJzcohazI4ly38LYjfSnjbWxOjPW20uOjOl5v/I/6FAX7uxRDXY59DVxqaofulV8JRuHdXayywDiwM3Ijp4qGAg5QGanAEpGzYSaOquHYhmeNO9Iu893qnHU05kbg+pJMhjx0f5a8OIKQz8z4rgPSMnOnmXq+i0cFFIKjqtxN2bwf1qicyZq4RREr+Muw4GwsvAu4ODmAHxA7dQGxlrkXUPbp4UenNzEB8f6doFpx8x66T1A0p3tAq4PaEfVOLv26TsHgAcnE4UVxOVgH9Q4CEcX3AE8ki4+GrAbgDjFfWMV5mc192DD3Dp1pF2Ik9X3ACnFVbNen3WAdl4EF0In88ifEAL6bTAFQ8c1XsRF/Ltt8BjF0NDy6LYHcRaq/3CawTLRmXvwG5OOY1AJiDFsYg8Aq4SQU3kHcLaW8wm5lQUQPoaHR+/ZQU8bPgBUc6DpugGt8PEckC4ByRQw2qhF8JuAh+l66ieEbfBqfpPdmMTGtIDT1phyKptKUH6SQUD4FFga9bcAW7tk+DnNs2gO9o0/2VIwswXjMA1RnZaMBzHXDnVLloC4ReXTU6BzQMHGhSG1MKPn5YG7N66Qbg+MBYTayYpbgIXJsJ/UHBD38PT2PstYJfRWCg6NyTi2AGj9AguIHeyhI5rL78lAN/D06c7ooqvGqbOqxPyjWXAtQ48bJCRWs7TgAFUTXfRF1c6wj9/qcAFY7YHwkgkpsotnoFrTbKTknRtijIC4lYF6gLyUoknVIuGn+9pLQKjcEJjk1J5wQOfuA1e2ao2tw7GePTkCQqnwAEmHy2Y4KEw+f5sd0RE2uyVolROm170Gb0heXo9mNcxFHXS2LWAMfXQ9os+Odpso69bwc8PiOgyLdlIVh9Ol3c1GOmJ/vZzO3q9JlP3gakc6DLrX2Zzb4TJcrptv+SXXoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoF+k/wHhBgFzuFSBLgAAAABJRU5ErkJggg=="} alt={name} className={styles.reviewCardImg} />
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
