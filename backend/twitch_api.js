const fetch = require("node-fetch");

class TwitchApi {
  constructor(client_id, client_secret) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.base = "https://api.twitch.tv/helix";
  }

  async _getAccessToken() {
    const data = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "client_credentials",
    };
    const response = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.text();

    try {
      const data = JSON.parse(result);
      return data.access_token;
    } catch (err) {
      throw new Error(
        `Error fetching access token. Expected JSON but got back: ${result}`
      );
    }
  }

  async _get(endpoint) {
    if (!this.access_token) {
      const access_token = await this._getAccessToken();
      if (!access_token)
        throw new Error(
          "Error requesting app access token. Make sure client_id and client_secret are provided."
        );
      this.access_token = access_token;
    }

    const url = this.base + endpoint;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Client-ID": this.client_id,
        Authorization: `Bearer ${this.access_token}`,
      },
    });

    if (response.status === 401) {
      // Token has probably expired. Clear it and call get again.
      // The second call should attempt to fetch a new token.
      this.access_token = null;
      this._get(endpoint);
    }

    return await response.json();
  }

  async getUsers(users) {
    const login = users.join(",");
    return await this._get(`/users?login=${login}`);
  }
}

module.exports = new TwitchApi(
  process.env.TWITCH_CLIENT_ID,
  process.env.TWITCH_CLIENT_SECRET
);
