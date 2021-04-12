package com.ziwg.reservatio.keycloak;

import com.ziwg.reservatio.profiles.TestProfile;
import lombok.val;
import org.keycloak.admin.client.resource.UsersResource;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.ArrayList;

@TestProfile
@Configuration
public class KeycloakClientConfigMock {

    @Bean
    public KeycloakClientMock keycloakClientMock() {
        val usersResource = Mockito.mock(UsersResource.class);
        return new KeycloakClientMock(usersResource, new ArrayList<>());
    }
}
