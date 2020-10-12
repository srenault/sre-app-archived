import { Subject } from 'rxjs';
import { format } from 'date-fns';

export default class ElectricityClient {
  constructor({ endpoint, request }) {
    if (!endpoint) throw new Error('Please specify endpoint');
    this.endpoint = endpoint;
    this.request = request;
    this.stream = this.initEvtSource();
  }

  initEvtSource() {
    const evtSource = new EventSource(`${this.endpoint}/electricity/stream`);

    const subject = new Subject();

    evtSource.onmessage = (message) => {
      const data = JSON.parse(message.data);
      subject.next(data);
    };

    evtSource.onerror = (error) => {
      subject.error(error);
    };

    return subject;
  }

  async fetchConsumption(dateFrom, dateTo) {
    const params = Object.entries({ dateFrom, dateTo }).reduce((acc, [name, date]) => {
      if (date) {
        const value = format(date, 'yyyy-MM-dd');
        return acc ? `${acc}&${name}=${value}` : `?${name}=${value}`;
      } else {
        return acc;
      }
    }, '');

    const response = await this.request(`${this.endpoint}/electricity/consumption${params}`);
    return response.json();
  }

  async fetchLatestLoad() {
    const response = await this.request(`${this.endpoint}/electricity/latest/load`);
    return response.json();
  }

  stream(listener) {
    this.subject.subscribe(listener);
  }
}
