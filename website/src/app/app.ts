import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { WhatsappFloatingComponent } from './shared/components/whatsapp-floating/whatsapp-floating.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, WhatsappFloatingComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
