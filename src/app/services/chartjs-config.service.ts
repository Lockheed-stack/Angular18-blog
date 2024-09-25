import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartjsConfigService {

  constructor() { }
  options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 15
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 15
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 15
          }
        }
      }
    }
  }
  GetChartjsOptions(){
    return this.options;
  }
}
