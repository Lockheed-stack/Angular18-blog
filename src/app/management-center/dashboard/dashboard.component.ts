import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { ChartModule } from 'primeng/chart';
import { ChartjsConfigService } from '../../services/chartjs-config.service';
import {MatExpansionModule} from '@angular/material/expansion';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
interface statistic_text {
  cols: number;
  rows: number;
  text: string;
  value:number;
}
interface statistic_chart {
  cols: number;
  rows: number;
  labels?: Array<string>,
  datasets: Array<{
    label?: string,
    data: Array<number>,
    fill?: boolean,
    tension?: number
  }>
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatGridListModule,
    MatCardModule,
    ChartModule,
    MatExpansionModule,
    NzStatisticModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  constructor(private chartjsSrv: ChartjsConfigService) { }

  // total statistic
  stat_total: statistic_text[] = [
    { text: '累计登录天数', cols: 2, rows: 1, value:1234567890},
    { text: '文章总阅读量', cols: 2, rows: 1, value:1234567890},
    { text: '文章总数', cols: 2, rows: 1, value:1234567890},
  ];
  stat_total_cols: number = 0;

  // today statistic
  stat_today:statistic_text[]=[
    {text:"今日新增文章数",cols:2,rows:1,value:123456789},
    {text:"今日新增文阅读量",cols:2,rows:1,value:123456789}
  ]
  stat_today_cols: number = 0;
  // 7-days statistic
  stat_chart_cols: number = 0;
  stat_chart: statistic_chart[] = [{
    cols: 2,
    rows: 2,
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        tension: 0.4
      },
    ]
  },
  {
    cols: 2,
    rows: 1,
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Second Dataset',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: true,
        tension: 0.4
      }
    ]
  }
  ];
  options = {};

  ngOnInit(): void {
    this.options = this.chartjsSrv.GetChartjsOptions();
    this.stat_total_cols = this.stat_total.length * 2;
    this.stat_today_cols *= 2;
    this.stat_chart_cols = this.stat_chart.length * 2;
  }
}
