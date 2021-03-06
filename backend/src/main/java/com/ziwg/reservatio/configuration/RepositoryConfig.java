package com.ziwg.reservatio.configuration;

import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.views.bookingviews.BookingServicesView;
import com.ziwg.reservatio.views.employees.EmployeeView;
import com.ziwg.reservatio.views.reservations.ServiceProvidersView;
import com.ziwg.reservatio.views.services.ServiceView;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class RepositoryConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        config.exposeIdsFor(EmployeeView.class, ServiceView.class, ServiceProvidersView.class, ServiceProvider.class, BookingServicesView.class);
    }
}
