export default class ReleasesClient {
  constructor({ endpoint }) {
    if (!endpoint) throw new Error('Please specify endpoint');
    this.endpoint = endpoint;
  }

  async list() {
    const response = await fetch(`${this.endpoint}`);
    return response.json();
  }
}
