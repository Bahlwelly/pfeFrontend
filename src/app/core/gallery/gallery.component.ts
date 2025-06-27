import { CommonModule } from '@angular/common';
import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatIconModule ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  constructor (@Inject(MAT_DIALOG_DATA) public data : {images : string[]} , private dialogRef : MatDialogRef<GalleryComponent>) {}
  
  close () {
    this.dialogRef.close();
  }

  selectedImage: string = this.data.images[0];

  toggleFullscreen(event: MouseEvent): void {
    const img = event.target as HTMLElement;
    if (img.requestFullscreen) {
      img.requestFullscreen();
    }
  }
}
