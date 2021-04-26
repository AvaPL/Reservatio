package com.ziwg.reservatio.controllers;


import com.ziwg.reservatio.entity.Reservation;
import com.ziwg.reservatio.entity.Review;
import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.pojos.ReviewToAdd;
import com.ziwg.reservatio.repository.ReservationRepository;
import com.ziwg.reservatio.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("${spring.data.rest.base-path}")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;

    @Autowired
    public ReviewController(ReviewRepository reviewRepository,
                            ReservationRepository reservationRepository){
        this.reviewRepository = reviewRepository;
        this.reservationRepository = reservationRepository;
    }

    @PostMapping("addReview/{reservationId}")
    public ResponseEntity<HttpStatus> addReview(@PathVariable Long reservationId,
                                                @RequestBody ReviewToAdd reviewToAdd){
        Optional<Reservation> reservation = reservationRepository.findById(reservationId);
        Review review = Review.builder().grade(reviewToAdd.getGrade()).message(reviewToAdd.getMessage()).reservation(reservation.get()).build();
        reviewRepository.save(review);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

}
