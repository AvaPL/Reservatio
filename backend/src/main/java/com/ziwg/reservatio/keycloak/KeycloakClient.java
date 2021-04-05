package com.ziwg.reservatio.keycloak;

import lombok.val;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class KeycloakClient {

    private final Keycloak keycloak;
    private final UsersResource usersResource;
    private final List<RoleRepresentation> availableRoles;

    public KeycloakClient(Keycloak keycloak, String realm) {
        this.keycloak = keycloak;
        this.usersResource = keycloak.realm(realm).users();
        this.availableRoles = keycloak.realm(realm).roles().list();
    }

    public void createUser(UserRepresentation userRepresentation, Set<String> roles) {
        val userCreatedResponse = usersResource.create(userRepresentation);
        val userId = CreatedResponseUtil.getCreatedId(userCreatedResponse);
        val createdUser = usersResource.get(userId);
        val rolesToAdd = getRolesToAdd(roles);
        createdUser.roles().realmLevel().add(rolesToAdd);
    }

    private List<RoleRepresentation> getRolesToAdd(Set<String> roles) {
        return availableRoles.stream().filter(r -> roles.contains(r.getName())).collect(Collectors.toList());
    }
}
