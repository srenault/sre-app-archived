export default class ElectricityClient {

  constructor({ endpoint, request }) {
    if (!endpoint) throw new Error('Please specify endpoint');
    this.endpoint = endpoint;
    this.request = request;
  }

  async fetchConsumption(dateFrom, dateTo) {
    const params = Object.entries({ dateFrom, dateTo }).reduce((acc, [name, value]) => {
      if (value) {
        return acc ? `&${acc}&${name}=${value}` : `?${name}=${value}`;
      } else {
        return acc;
      }
    }, "");

    const response = await this.request(`${this.endpoint}/electricity/consumption${params}`);
    return response.json();
  }

  async fetchLatestLoad() {
    const response = await this.request(`${this.endpoint}/electricity/latest/load`);
    return response.json();
  }
}
