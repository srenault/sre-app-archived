export default class ReleasesClient {
  constructor({ endpoint, request }) {
    if (!endpoint) throw new Error('Please specify endpoint');
    this.endpoint = endpoint;
    this.request = request;
  }

  async list() {
    const response = await this.request(`${this.endpoint}`);
    return response.json();
  }
}
