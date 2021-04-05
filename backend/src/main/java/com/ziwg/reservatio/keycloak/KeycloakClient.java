package com.ziwg.reservatio.keycloak;

import com.ziwg.reservatio.keycloak.user.SimpleUserRepresentation;
import lombok.val;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;

import javax.ws.rs.core.Response;

public class KeycloakClient {

    private final Keycloak keycloak;
    private final UsersResource userResource;

    public KeycloakClient(Keycloak keycloak, String realm) {
        this.keycloak = keycloak;
        this.userResource = keycloak.realm(realm).users();
    }

    public Response createUser(String email, String password, String firstName, String lastName) {
        val userRepresentation = SimpleUserRepresentation.builder().email(email).password(password).username(email)
                .firstName(firstName).lastName(lastName).build();
        return userResource.create(userRepresentation);
    }

    public Response createUser(String email, String password, String username) {
        val userRepresentation = SimpleUserRepresentation.builder().email(email).password(password)
                .username(username).build();
        return userResource.create(userRepresentation);
    }
}
