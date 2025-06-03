import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { UserDetailsComponent } from './pages/users/user-details/user-details.component';
import { ListNoirComponent } from './pages/users/list-noir/list-noir.component';
import { ChefsComponent } from './pages/users/chefs/chefs.component';
import { PlaintesListComponent } from './pages/plaintes/plaintes-list/plaintes-list.component';
import { PlainteDetailsComponent } from './pages/plaintes/plainte-details/plainte-details.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AccessNonAuthComponent } from './core/access-non-auth/access-non-auth.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path : '', component : LoginComponent},
    {path : 'home', component: MainComponent, canActivateChild: [authGuard] ,children : [
        {path:'', redirectTo:'dashboard', pathMatch: 'full'},
        {path : 'dashboard', component : DashboardComponent},
        {path : 'users', component :UsersListComponent},
        {path : 'user/details/:id', component: UserDetailsComponent},
        {path : 'users/noir', component : ListNoirComponent},
        {path : 'chefs', component : ChefsComponent},
        {path : 'plaintes', component : PlaintesListComponent},
        {path : 'details/plainte/:id', component : PlainteDetailsComponent}
    ]},

    {path : 'access-non-authoriser', component : AccessNonAuthComponent}
];
