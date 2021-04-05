package com.ziwg.reservatio.keycloak.user;

import lombok.Builder;
import lombok.val;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.Collections;

public class SimpleUserRepresentation extends UserRepresentation {

    @Builder
    public SimpleUserRepresentation(String email, String password, String username, String firstName, String lastName) {
        this.email = email;
        this.credentials = Collections.singletonList(passwordCredential(password));
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.enabled = true;
    }

    private CredentialRepresentation passwordCredential(String password) {
        val credentialRepresentation = new CredentialRepresentation();
        credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
        credentialRepresentation.setValue(password);
        credentialRepresentation.setTemporary(false);
        return credentialRepresentation;
    }
}
