package com.ziwg.reservatio.keycloak;

import lombok.Getter;
import lombok.Setter;
import lombok.val;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "reservatio.keycloak")
@Getter
@Setter
public class KeycloakClientConfig {

    private String serverUrl;
    private String username;
    private String password;
    private String realm;
    private String clientId;

    @Bean
    public KeycloakClient keycloakClient() {
        val keycloak = KeycloakBuilder.builder().serverUrl(serverUrl).username(username).password(password)
                .realm("master").clientId(clientId).build();
        return new KeycloakClient(keycloak, realm);
    }
}
