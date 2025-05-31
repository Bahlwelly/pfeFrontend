import { Component, inject } from '@angular/core';
import { UserService } from '../../services/usersService/user.service';
import { User } from '../../interfaces/user';
import { PlaintesService } from '../../services/plaintesService/plaintes.service';
import { Plaintes } from '../../interfaces/plaintes';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private usersService = inject(UserService);
  users : User[] = [];
  usersNumber : number = 0;
  blockedUsersNumber : number = 0;
  chefsNumber : number = 0;

  private plaintesService = inject(PlaintesService);
  plaintes : Plaintes[] = [];
  plaintesNumber : number = 0;
  plaintesNonInspectNumber : number = 0;
  invalidPlaintesNumber : number = 0;

  loadData () {
      forkJoin ({
        plaintes : this.plaintesService.getPlaintes(),
        users : this.usersService.getUsers()
      }).subscribe( ({ plaintes, users }) => {
        this.usersNumber = users.filter(user => user.role == 'CITOYEN').length;
        this.blockedUsersNumber = users.filter(user => user.blocquee == 'blocquee').length;
        this.chefsNumber = users.filter(user => user.role == 'CHEF').length;

        this.plaintesNumber = plaintes.filter(plainte => plainte.examiner == 'examinee' && plainte.valid == 'valid').length;
        this.invalidPlaintesNumber = plaintes.filter(plainte => plainte.valid !== 'valid').length;
        this.plaintesNonInspectNumber = plaintes.filter(plainte => plainte.examiner !== 'examinee').length;
      })
  }

  ngOnInit () {
    this.loadData()
  }
}
