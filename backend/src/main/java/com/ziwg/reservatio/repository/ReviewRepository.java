package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Review;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ReviewRepository extends PagingAndSortingRepository<Review, Long> {
}
