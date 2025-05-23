import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { UserDetailsComponent } from './pages/users/user-details/user-details.component';
import { ListNoirComponent } from './pages/users/list-noir/list-noir.component';
import { ChefsComponent } from './pages/users/chefs/chefs.component';
import { PlaintesListComponent } from './pages/plaintes/plaintes-list/plaintes-list.component';
import { PlainteDetailsComponent } from './pages/plaintes/plainte-details/plainte-details.component';

export const routes: Routes = [
    {path : '', component : LoginComponent},
    {path : 'home', component: MainComponent, children : [
        {path:'', redirectTo:'users', pathMatch: 'full'},
        {path : 'users', component :UsersListComponent},
        {path : 'user/details/:id', component: UserDetailsComponent},
        {path : 'users/noir', component : ListNoirComponent},
        {path : 'chefs', component : ChefsComponent},
        {path : 'plaintes', component : PlaintesListComponent},
        {path : 'details/plainte/:id', component : PlainteDetailsComponent}
    ]},
];
