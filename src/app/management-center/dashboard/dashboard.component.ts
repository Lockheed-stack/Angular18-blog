import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { ChartModule } from 'primeng/chart';
import { ChartjsConfigService } from '../../services/chartjs-config.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserDayStatInfo, UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';
import { HttpErrorResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';
interface statistic_text {
  cols: number;
  rows: number;
  text: string;
  value: number;
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  constructor(
    private chartjsSrv: ChartjsConfigService,
    private userService: UserService,
  ) { }
  readonly snackbar = inject(MatSnackBar);

  snackBarTips(content: string) {
    this.snackbar.openFromComponent(SnackBarComponent, {
      data: {
        content: content
      }
    })
  }

  // total statistic
  stat_total: statistic_text[] = [
    { text: '累计登录天数', cols: 2, rows: 1, value: 0 },
    { text: '文章总阅读量', cols: 2, rows: 1, value: 0 },
    { text: '文章总数', cols: 2, rows: 1, value: 0 },
  ];
  stat_total_cols: number = 0;

  // today statistic
  stat_today: statistic_text[] = [
    { text: "今日新增文章数", cols: 2, rows: 1, value: 0 },
    { text: "今日新增文章阅读量(PV)", cols: 2, rows: 1, value: 0 },
    { text: "今日新增独立访客量(UV)", cols: 2, rows: 1, value: 0 }
  ]
  stat_today_cols: number = 0;
  // 7-days statistic
  stat_chart_cols: number = 0;
  stat_chart: statistic_chart[] = [ ];
  options = {};


  ngOnInit(): void {
    // display interface settings
    this.options = this.chartjsSrv.GetChartjsOptions();
    this.stat_total_cols = this.stat_total.length * 2;
    this.stat_today_cols *= 2;
    this.stat_chart_cols = this.stat_chart.length * 2;
    // get statistics infomations
    this.userService.GetUserTotalStatisticsInfo().subscribe(
      {
        next: (value) => {
          value.result.TotalLoginDays === undefined ? this.stat_total[0].value = 0 : this.stat_total[0].value = value.result.TotalLoginDays;
          value.result.TotalPageviews === undefined ? this.stat_total[1].value = 0 : this.stat_total[1].value = value.result.TotalPageviews;
          value.result.TotalLoginDays === undefined ? this.stat_total[2].value = 0 : this.stat_total[2].value = value.result.TotalBlogs;
        },
        error: (err) => {
          const e = (err as HttpErrorResponse).message;
          this.snackBarTips(`出现错误: ${e}`);
        }
      }
    )
    // get today statistics infomations
    this.userService.GetUserTodayStatisticsInfo().subscribe(
      {
        next: (value) => {
          value.result.TotalBlogs === undefined ? this.stat_today[0].value = 0 : this.stat_today[0].value = value.result.TotalBlogs;
          value.result.TotalPageviews === undefined ? this.stat_today[1].value = 0 : this.stat_today[1].value = value.result.TotalPageviews;
          value.result.TotalUniqueviews === undefined ? this.stat_today[2].value = 0 : this.stat_today[2].value = value.result.TotalUniqueviews;
        },
        error: (err) => {
          const e = (err as HttpErrorResponse).message;
          this.snackBarTips(`出现错误: ${e}`);
        }
      }
    )
    // get seven days statistics infomations
    this.userService.GetUserSevenDaysStatisticsInfo().subscribe(
      {
        next: (value) => {

          // processing received result
          let recorded_date: Map<string, UserDayStatInfo> = new Map<string, UserDayStatInfo>();
          if (value.result !== null) {
            for (let index = 0; index < value.result.length; index++) {
              const element = value.result[index];
              value.result[index].CreatedAt = formatDate(element.CreatedAt, "y/M/d", "en-US");
              recorded_date.set(value.result[index].CreatedAt, value.result[index]);
            }
          }

          // converting to usable data
          let pv_data: number[] = [];
          let uv_data: number[] = [];
          let labels: string[] = [];
          for (let i = 7; i >= 1; i--) {
            let today = new Date();
            today.setDate(today.getDate() - i);
            const day = today.toLocaleDateString();
            labels.push(day);
            if (recorded_date.has(day)) {
              const pv = recorded_date.get(day).Pv;
              const uv = recorded_date.get(day).Uv;
              pv_data.push(pv);
              uv_data.push(uv);
            } else {
              pv_data.push(0);
              uv_data.push(0);
            }
          }

          // creating 7-day-chart data structures
          this.stat_chart.push(
            {
              cols: 2,
              rows: 2,
              labels: labels,
              datasets: [
                {
                  label: '近七日 PV 数据',
                  data: pv_data,
                  fill: true,
                  tension: 0.4
                },
              ]
            },
            {
              cols: 2,
              rows: 2,
              labels: labels,
              datasets: [
                {
                  label: '近七日 UV 数据',
                  data: uv_data,
                  fill: true,
                  tension: 0.4
                }
              ]
            }
          )

        },
        error: (err) => {
          const e = (err as HttpErrorResponse).message;
          this.snackBarTips(`出现错误: ${e}`);
        }
      }
    )

  }
}
