package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.views.bookingviews.BookingView;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface BookingViewRepository extends PagingAndSortingRepository<BookingView, Long>{
}
