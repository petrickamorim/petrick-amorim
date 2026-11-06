import { Component } from '@angular/core';
import { Nav } from './layout/nav/nav';
import { Contact } from './sections/contact/contact';
import { Experience } from './sections/experience/experience';
import { Home } from './sections/home/home';
import { Projects } from './sections/projects/projects';
import { Stack } from './sections/stack/stack';

@Component({
  selector: 'app-root',
  imports: [Nav, Home, Stack, Projects, Experience, Contact],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
