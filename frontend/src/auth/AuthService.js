import jwtDecode from "jwt-decode";
import {keycloakAuthServerUrl, keycloakClientId, keycloakRealm} from "../Config";

const authStorageKey = 'reservatio-auth'

class AuthService {

    constructor(keycloakUrl, realm, clientId) {
        this.keycloakUrl = keycloakUrl
        this.realm = realm
        this.clientId = clientId
        this.setToken(JSON.parse(localStorage.getItem(authStorageKey)))
    }

    setToken(token) {
        if (!token)
            return
        const accessToken = token.access_token
        const decodedAccessToken = jwtDecode(accessToken)
        this.token = {
            accessToken: accessToken,
            refreshToken: token.refresh_token,
            refreshExpiresIn: token.refresh_expires_in,
            tokenType: token.token_type,
            expires: decodedAccessToken.exp,
            roles: decodedAccessToken.realm_access.roles,
            username: decodedAccessToken.preferred_username,
            email: decodedAccessToken.email,
            entityId: decodedAccessToken.entity?.id
        }
    }

    login(username, password) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'client_id': this.clientId,
                'grant_type': 'password',
                'username': username,
                'password': password
            })
        }
        return this.fetchToken(requestOptions);
    }

    fetchToken(requestOptions) {
        return fetch(`${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`, requestOptions)
            .then(response => {
                if (!response.ok)
                    this.onTokenFetchError(response);
                return response.json()
            })
            .then(token => {
                localStorage.setItem(authStorageKey, JSON.stringify(token))
                this.setToken(token)
                return true
            })
            .catch(error => {
                console.log('Token fetch error', error)
                return false
            })
    }

    onTokenFetchError(response) {
        if ([401, 403].indexOf(response.status) !== -1) {
            this.logout()
        }
        throw new Error(response.statusText)
    }

    logout() {
        localStorage.removeItem(authStorageKey)
        this.token = null
    }

    refreshToken() {
        if (!this.canTokenBeRefreshed())
            return Promise.resolve(false)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'client_id': this.clientId,
                'grant_type': 'refresh_token',
                'refresh_token': this.token.refreshToken,
            })
        }
        return this.fetchToken(requestOptions)
    }

    canTokenBeRefreshed() {
        return this.token &&
            Date.now() <= (this.token.expires + this.token.refreshExpiresIn) * 1000
    }

    isTokenExpired(minValidity = 30) {
        return this.token == null ||
            Date.now() >= (this.token.expires - minValidity) * 1000
    }

    userHasRole(role) {
        return this.token?.roles.includes(role)
    }

    fetchAuthenticated(input, init, onAuthFailure = () => Promise.reject(new Error("Auth failure"))) {
        if (!this.token)
            return onAuthFailure()
        if (!this.isTokenExpired())
            return fetch(input, this.authenticatedFetchInit(init))
        if (this.canTokenBeRefreshed())
            return this.refreshToken().then(refreshSuccess => {
                if (refreshSuccess)
                    return fetch(input, this.authenticatedFetchInit(init))
                else
                    return onAuthFailure()
            })
        return onAuthFailure()
    }

    authenticatedFetchInit(init) {
        return {
            ...init,
            headers: {
                ...init?.headers,
                'Authorization': `${this.token.tokenType} ${this.token.accessToken}`
            }
        }
    }

    isUserAuthenticated() {
        return this.token && (!this.isTokenExpired() || this.canTokenBeRefreshed())
    }
}

export const authService = new AuthService(keycloakAuthServerUrl, keycloakRealm, keycloakClientId)
