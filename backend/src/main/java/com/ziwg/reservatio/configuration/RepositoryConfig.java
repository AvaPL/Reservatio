package com.ziwg.reservatio.configuration;

import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.view.ServiceProvidersView;
import com.ziwg.reservatio.views.bookingviews.BookingServicesView;
import com.ziwg.reservatio.views.bookingviews.BookingView;
import com.ziwg.reservatio.views.employees.EmployeeView;
import com.ziwg.reservatio.views.reservation.ServiceProvidersView;
import com.ziwg.reservatio.views.services.ServiceView;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Component
public class RepositoryConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        config.exposeIdsFor(EmployeeView.class, ServiceView.class, ServiceProvidersView.class, ServiceProvider.class, BookingServicesView.class);
    }
}
