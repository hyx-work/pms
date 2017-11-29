import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ListMetrics, ItemMetrics } from '../../pm/pm-dashboard.component/card-data.Entity';
import { DashboardService } from '../../pm/pm-dashboard.component/dashboard.service';
import { MatDialog } from '@angular/material';
// import { DemandDetailModalComponent } from '../demand-detail-modal/demand-detail-modal.component';

@Component({
  selector: 'app-dev-dashboard',
  templateUrl: './dev-dashboard.component.html',
  styleUrls: ['./dev-dashboard.component.scss']
})

export class DevDashboardComponent implements OnInit {

  public activityData: any[] = [];
  public testResultData: any[] = [];

  constructor(private router: Router, private service: DashboardService, private dialog: MatDialog) { }

  // 项目ID
  projectId: string;

  ngOnInit() {
    this.projectId = sessionStorage.getItem('projectId');
    if (!this.projectId) {
      this.router.navigate(['/welcome']);
    } else {
      this.initData();
    }
  }

  // 初始化数据 调用三个接口
  initData() {
    this.getProjectActivity();
    this.getProjectTestResult();
  }

  getProjectActivity() {
    this.service.getProjectActivity(this.projectId)
      .then(res => {

        this.activityData.push(
          new ListMetrics(
            '进行中活动',
            res
              .filter(i => {
                return i.status === 'dev-ing';
              })
              .map(i => {
                return new ItemMetrics(i, i.title, i.createAt, i.memberName, '', '');
              })
          )
        );

        this.activityData.push(
          new ListMetrics(
            '待测试活动',
            res
              .filter(i => {
                return i.status === 'needtest';
              })
              .map(i => {
                return new ItemMetrics(i, i.title, i.createAt, i.memberName, '', '');
              })
          )
        );

        this.activityData.push(
          new ListMetrics(
            '全部活动',
            res
              .map(i => {
                return new ItemMetrics(i, i.title, i.createAt, i.memberName, '', '');
              })
          )
        );

      }).catch(err => console.log(err));
  }

  getProjectTestResult() {
    this.service.getProjectTestResult(this.projectId)
      .then(res => {

        this.testResultData.push(
          new ListMetrics(
            '待修复测试结果',
            res
              .filter(i => {
                return i.status === 'tofix';
              })
              .map(i => {
                return new ItemMetrics(i, i.name, '', i.ownerName, '', i.level);
              })
          )
        );

        this.testResultData.push(
          new ListMetrics(
            '待审核测试结果',
            res
              .filter(i => {
                return i.status === 'tocheck';
              })
              .map(i => {
                return new ItemMetrics(i, i.name, '', i.ownerName, '', i.level);
              })
          )
        );

        this.testResultData.push(
          new ListMetrics(
            '已通过测试结果',
            res
              .map(i => {
                return new ItemMetrics(i, i.name, '', i.ownerName, '', i.level);
              })
          )
        );

      }).catch(err => console.log(err));
  }

  addItem() {
    console.log('add');
  }

  // showDemandDetail(data) {
  //   const dialogRef = this.dialog.open(DemandDetailModalComponent, {
  //     width: '750px',
  //     height: '61vh',
  //     data: data
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }

  showActivityDetail(data) {
    console.log(data);
  }
  showResultDetail(data) {
    console.log(data);
  }
}
