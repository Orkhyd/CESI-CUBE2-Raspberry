import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { empty } from 'rxjs';

// Affectation des variables
let connectRasp = false;

function getCurrentTime(): string {
  const date: Date = new Date();
  const hours: string = ("0" + date.getHours()).slice(-2);
  const minutes: string = ("0" + date.getMinutes()).slice(-2);
  const seconds: string = ("0" + date.getSeconds()).slice(-2);
  return `${hours}:${minutes}:${seconds}`;
}
setInterval(getCurrentTime, 500);

@Component({
  selector: 'app-testcomponent',
  templateUrl: './testcomponent.component.html',
  styleUrls: ['./testcomponent.component.scss']
})

export class TestcomponentComponent implements OnInit {
  heure!: string;
  degre?: number;
  pression?: number;
  humidite?: number;
  derniereActu?: string;
  response?: JSON;
  renderer: Renderer2;

  constructor(renderer: Renderer2, private http: HttpClient) {
    this.renderer = renderer;
  }

  ngOnInit() {
    setInterval(() => { this.heure = getCurrentTime(); }, 500);

    setInterval(async () => {
      try {
        const response = await this.http.get<any>("https://sonde.up.railway.app/recordings/last", { observe: 'response' }).toPromise();
        if (response?.status === 200) {
          try {
            //recuperer les data ici
            const jsonData = response.body[0];
            this.degre = jsonData.temperature;
            this.pression =  jsonData.pressure;
            this.humidite = jsonData.hygrometry;
            this.derniereActu = jsonData.timeStamp;
            connectRasp = true;
            this.changeValue();
          } catch (error) {
            console.log("Impossible de récupérer les données. Error: " + error);
            connectRasp = false;
            this.changeValue();
          }
        } else {
          console.log("Code de statut : " + response?.status);
          connectRasp = false;
          this.changeValue();
        }
      } catch (error) {
        console.log("Impossible de se connecter au serveur. Error: " + error);
        connectRasp = false;
        this.changeValue();
      }
    }, 6000); //Essaye de se connecter pour récupérer les données toutes les 6s (10x par minute)
  }   

  changeValue() {
    const passageVert = document.getElementById('changeColor')!;
    const changeImgRed = this.renderer.selectRootElement('#changeImgRed');
    const changeImgGreen = this.renderer.selectRootElement('#changeImgGreen');

    if (connectRasp) {
        // Le code à exécuter si connectRasp est vrai
        passageVert.style.backgroundColor = '#00ff00';
        changeImgRed.style.display = "none";
        changeImgGreen.style.display = "block";
    } else {
        // Le code à exécuter si connectRasp est faux
        passageVert.style.backgroundColor = '#ff0000';
        changeImgRed.style.display = "block";
        changeImgGreen.style.display = "none";
        this.degre = undefined;
        this.pression = undefined;
        this.humidite = undefined;
        this.derniereActu = "";
    }
  }
}