
export default class UserDetailCache {

    constructor() {

    }

    cacheUserDetail(sessionId, userId, userName, isHost, isObserver, token) {
        const userCache = {
            id: userId,
            name: userName,
            isHost: isHost,
            isObserver: isObserver,
            token: token
        }
        localStorage.setItem(sessionId, JSON.stringify(userCache));
    }
    getUserToken(sessionId) {
        const userCache = localStorage.getItem(sessionId);
        return JSON.parse(userCache).token;
    }

    removeUserToken(sessionId) {
        localStorage.removeItem(sessionId);
    }

    getUserDetail(sessionId) {
        return JSON.parse(localStorage.getItem(sessionId));
    }

    sessionWasRefreshed(sessionInformation) {
        const userCache = JSON.parse(localStorage.getItem(sessionInformation.sessionId));
        const userDetail = sessionInformation.participants.filter(function (a) {
            if (a.id == userCache.id) return a
        })[0];
        this.cacheUserDetail(sessionInformation.sessionId, userDetail.id, userDetail.name, userDetail.isHost, userDetail.isObserver, userCache.token);
    }
}