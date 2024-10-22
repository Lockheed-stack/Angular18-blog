import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CategoryInfo, CategoryService } from '../../services/category.service';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface CategoryInfoWithOperations {
  info: CategoryInfo,
  opt: string
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit,AfterViewInit{
  constructor(
    private categoryService: CategoryService,
  ) { }
  readonly snackbar = inject(MatSnackBar);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoadingResults = true;

  dataSource:MatTableDataSource<CategoryInfoWithOperations> = new MatTableDataSource<CategoryInfoWithOperations>();

  categoryinfo: CategoryInfoWithOperations[] = [];
  displayedColumns: string[] = ['id', 'name', 'opt',];

  ngOnInit(): void {
      this.categoryService.GetAllCategory().subscribe({
        next:(value)=>{
          for (let item of value){
            this.categoryinfo.push({info:item,opt:"删除"});
          }
          this.dataSource.data = this.categoryinfo;
          this.isLoadingResults = false;
        },
        error:(err)=>{
          const e = (err as HttpErrorResponse).message;
          this.snackbar.openFromComponent(SnackBarComponent, {
            data: {
              content: e
            }
          })
        }
      })
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

}
