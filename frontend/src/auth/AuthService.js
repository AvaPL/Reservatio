import jwtDecode from "jwt-decode";

const authKey = 'reservatio-auth'

class AuthService {

    constructor(keycloakUrl, realm, clientId) {
        this.keycloakUrl = keycloakUrl
        this.realm = realm
        this.clientId = clientId
        this.setToken(JSON.parse(localStorage.getItem(authKey)))
    }

    setToken(token) {
        if (token == null)
            return
        const accessToken = token.access_token
        const decodedAccessToken = jwtDecode(accessToken)
        this.token = {
            accessToken: accessToken,
            refreshToken: token.refresh_token,
            refreshExpiresIn: token.refresh_expires_in,
            tokenType: token.token_type,
            exp: decodedAccessToken.exp,
            roles: decodedAccessToken.realm_access.roles,
            username: decodedAccessToken.preferred_username,
            email: decodedAccessToken.email
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
                    this.handleLoginError(response);
                return response.json()
            })
            .then(token => {
                localStorage.setItem(authKey, JSON.stringify(token))
                this.setToken(token)
                return true
            })
            .catch(error => {
                console.log('error', error)
                return false
            })
    }

    handleLoginError(response) {
        if ([401, 403].indexOf(response.status) !== -1) {
            this.logout()
        }
        throw new Error(response.statusText)
    }

    logout() {
        localStorage.removeItem(authKey)
        this.token = null
    }

    refresh() {
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
                'username': this.token.refreshToken,
            })
        }
        return this.fetchToken(requestOptions)
    }

    canTokenBeRefreshed() {
        return this.token !== null &&
            Date.now() <= (this.token.exp + this.token.refreshExpiresIn) * 1000
    }

    isTokenExpired(minValidity = 30) {
        return Date.now() >= (this.token.exp - minValidity) * 1000
    }

    hasRole(role) {
        this.token?.roles.includes(role)
    }
}

// TODO: Load params from env
export const authService = new AuthService('http://localhost:8180/auth', 'reservatio', 'reservatio')
