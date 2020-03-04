import ElectricityClient from './ElectricityClient';

export default class EnergyClient {
  constructor({ endpoint, request }) {
    if (!endpoint) throw new Error('Please specify endpoint');
    this.endpoint = endpoint;
    this.request = request;
    this.electricity = new ElectricityClient({ endpoint, request });
  }
}
