

export default class PlanningPokerService {

    constructor(apiUrl, apiKey) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    getSessionDetails(sessionId) {
        return fetch(`${this.apiUrl}/Sessions/${sessionId}`, {
            method: 'GET',
            headers: {
                'user-key': apiKey
            }
        });
    }

}