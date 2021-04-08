const authKey = 'reservatio-auth'

class AuthService {

    constructor(keycloakUrl, realm, clientId) {
        this.keycloakUrl = keycloakUrl
        this.realm = realm
        this.clientId = clientId
        this.token = JSON.parse(localStorage.getItem(authKey))
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
        return fetch(`${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`, requestOptions)
            .then(response => {
                if (!response.ok)
                    this.handleLoginError(response);
                return response.json()
            })
            .then(token => {
                localStorage.setItem(authKey, JSON.stringify(token))
                this.token = token
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

    refreshToken() {
        // TODO: Implement
    }

    hasRole() {
        // TODO: Implement
    }
}

// TODO: Load params from env
export const authService = new AuthService('http://localhost:8180/auth', 'reservatio', 'reservatio')
