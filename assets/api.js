const jsonHeader = {'Content-Type': 'application/json'}

class API {
    #apiKey = null;

    constructor(url) {
        this.url = url;
    }

    authHeader(key) {
        if (key) {
            return {'Authorization': `Bearer ${key}`}
        } else {
            return {};
        }
        
    }

    setKey(newKey) {
        this.#apiKey = newKey
    }

    async generateKey(apiKey) {
        return await fetch(this.url + '/genkey', {
            method: 'POST',
            headers: this.authHeader(this.#apiKey)
        });
    }

    async addPerson(first, last) {
        await fetch(this.url + "/addperson", {
            method: "POST",
            headers: { ...this.authHeader(this.#apiKey), ...jsonHeader},
            body: JSON.stringify({
                first: first,
                last: last
            })
        });
    }

    async removePerson(uid) {
        await fetch(this.url + "/removeperson", {
            method: "POST",
            headers: { ...this.authHeader(this.#apiKey), ...jsonHeader},
            body: JSON.stringify({
                uid: uid
            })
        });
    }

    async setPoints(uid, points) {
        return await fetch(this.url + "/setpoints", {
            method: "POST",
            headers: { ...this.authHeader(this.#apiKey), ...jsonHeader},
            body: JSON.stringify({
                uid: uid,
                points: points
            })
        });
    }

    async addPoints(uid, points) {
        return await fetch(this.url + "/addpoints", {
            method: "POST",
            headers: { ...this.authHeader(this.#apiKey), ...jsonHeader},
            body: JSON.stringify({
                uid: uid,
                points: points
            })
        });
    }

    async removeKey() {
        await fetch(this.url + '/removekey', {
            method: 'POST',
            headers: this.authHeader(this.#apiKey)
        })
    }

    async getUid(first, last) {
        const params = new URLSearchParams();
        params.append('first', first);
        params.append('last', last);
        return await fetch(this.url + '/getuid?' + params.toString());
    }

    async getPoints(uid) {
        const params =  new URLSearchParams();
        params.append('uid', uid);
        return await fetch(this.url + "/getpoints?" + params.toString());
    }

    async getAllUsers() {
        return await fetch(this.url + "/getall");
    }
}