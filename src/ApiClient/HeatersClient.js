export default class HeatersClient {
  constructor({ endpoint, request }) {
    if (!endpoint) throw new Error('Please specify endpoint');
    this.endpoint = endpoint;
    this.request = request;
  }

  async status() {
    const response = await this.request(`${this.endpoint}/status`);
    return response.json();
  }

  async update(channel, mode) {
    const url = `${this.endpoint}/channel/${channel}`;
    const options = {
      method: 'PUT',
      body: JSON.stringify({ mode }),
    };
    const response = await this.request(url, options);
    return response.json();
  }
}
