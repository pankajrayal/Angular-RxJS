import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of, Subject } from 'rxjs';
import { map, catchError, startWith } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  categories;
  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();


  // products$ = this.productService.productsWithCategory$
  //   .pipe(
  //     catchError(err=> {
  //       this.errorMessage = err;
  //       return EMPTY;
  //     })      
  //   );
  products$ = combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$.pipe(
      startWith(0)
    )
  ]) 
    .pipe(
      map(([products, selectedCategoryId])=> 
        products.filter(product => 
          selectedCategoryId ? product.categoryId === selectedCategoryId : true
    )),
      catchError(err=> {
        this.errorMessage = err;
        return EMPTY;
      })      
    );
  categories$ = this.categoryService.productCategories$
      .pipe(
        catchError(err=> {
          this.errorMessage = err;
          return EMPTY;
        })
      );

  constructor(private productService: ProductService, private categoryService: ProductCategoryService) { }

  ngOnInit(): void {
  }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}