

export default class PlanningPokerService {

    constructor(apiUrl, apiKey) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    getSessionDetails(sessionId) {
        var self = this;
        return new Promise(function (resolve, reject) {
            fetch(`${self.apiUrl}/Sessions/${sessionId}`, {
                method: 'GET',
                headers: {
                    'user-key': self.apiKey
                }
            }).then(response => {
                response.text().then(textResponse => {
                    resolve(JSON.parse(textResponse));
                });
            });
        });
    }

}