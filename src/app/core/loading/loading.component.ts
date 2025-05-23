import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { LoadingService } from '../../services/loadingService/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  loadingService = inject(LoadingService);

}
