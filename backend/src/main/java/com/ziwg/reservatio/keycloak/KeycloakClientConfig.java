package com.ziwg.reservatio.keycloak;

import com.ziwg.reservatio.profiles.ProdProfile;
import lombok.Getter;
import lombok.Setter;
import lombok.val;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@ProdProfile
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
        val keycloak = KeycloakBuilder.builder().serverUrl(serverUrl).grantType(OAuth2Constants.PASSWORD)
                .username(username).password(password).realm(realm).clientId(clientId).build();
        val keycloakRealm = keycloak.realm(realm);
        val usersResource = keycloakRealm.users();
        val availableRoles = keycloakRealm.roles().list();
        return new KeycloakClient(usersResource, availableRoles);
    }
}
