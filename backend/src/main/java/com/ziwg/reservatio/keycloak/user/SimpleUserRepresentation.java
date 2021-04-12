package com.ziwg.reservatio.keycloak.user;

import com.google.common.collect.Maps;
import lombok.Builder;
import lombok.Singular;
import lombok.val;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.Collections;
import java.util.Map;

public class SimpleUserRepresentation extends UserRepresentation {

    @Builder
    public SimpleUserRepresentation(String email, String password, String username, String firstName,
                                    String lastName, @Singular Map<String, String> attributes) {
        this.email = email;
        this.credentials = Collections.singletonList(passwordCredential(password));
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.enabled = true;
        this.attributes = Maps.transformValues(attributes, Collections::singletonList);
    }

    private CredentialRepresentation passwordCredential(String password) {
        val credentialRepresentation = new CredentialRepresentation();
        credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
        credentialRepresentation.setValue(password);
        credentialRepresentation.setTemporary(false);
        return credentialRepresentation;
    }
}
