package com.ziwg.reservatio.keycloak;

import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.List;
import java.util.Set;

public class KeycloakClientMock extends KeycloakClient {

    public KeycloakClientMock(UsersResource usersResource, List<RoleRepresentation> availableRoles) {
        super(usersResource, availableRoles);
    }

    @Override
    public void createUser(UserRepresentation userRepresentation, Set<String> roles) {
    }
}
