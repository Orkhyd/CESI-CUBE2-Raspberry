import { Component, OnInit, Renderer2, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';

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
  derniereActuFinal?: string;
  response?: JSON;
  renderer: Renderer2;

  constructor(renderer: Renderer2, private http: HttpClient) {
    this.renderer = renderer;
  }

  ngOnInit() {
    setInterval(() => { this.heure = getCurrentTime(); }, 500);

    setInterval(async () => {
      try {
        const response = await this.http.get<any>("http://140.238.217.125:3000/recordings/last", { observe: 'response' }).toPromise();
        if (response?.status === 200) {
          try {
            //Recupère Data en JSON
            const jsonData = response.body[0];
            this.degre = jsonData.temperature;
            this.pression =  jsonData.pressure;
            this.humidite = jsonData.hygrometry;
            this.derniereActu = jsonData.timeStamp;
            connectRasp = true;
            this.changeValue();
            if (this.derniereActu === this.derniereActuFinal) {
              connectRasp = false;
            } else {
              connectRasp = true;
            }
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
    }, 12000); //Essaye de se connecter pour récupérer les données toutes les 12s
  }

  ngAfterViewInit() {
    const canvas = document.getElementById('barCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['15/03/2023 à 08:11:01', '15/03/2023 à 08:11:13', '15/03/2023 à 08:11:25', '15/03/2023 à 08:11:37', '15/03/2023 à 08:11:49', '15/03/2023 à 08:12:01', '15/03/2023 à 08:12:13', '15/03/2023 à 08:12:25', '15/03/2023 à 08:12:37', '15/03/2023 à 08:12:49'],
          datasets: [{
            label: 'Temperature',
            data: [18.44, 18.52, 18.55, 19.05, 18.97, 18.72, 18.60, 18.72, 18.74, 18.85],
            backgroundColor: ['grey', 'red', 'blue', 'grey', 'red', 'blue', 'grey', 'red', 'blue', 'purple']
          }],
        },
      });
    } else {
      console.error('Could not get canvas context.');
    }
  };
  changeValue() {
    const passageVert = document.getElementById('changeColor')!;
    const divConnect = document.getElementById('divConnect')!;

    if (connectRasp) {
        // Le code à exécuter si connectRasp est vrai
        passageVert.style.background = '#00ff00';
        passageVert.style.transition = 'background 2s ease-in-out';
        divConnect.style.background = '#00ff00';
        divConnect.style.transition = 'background 2s ease-in-out';
    } else {
        // Le code à exécuter si connectRasp est faux
        passageVert.style.background = '#ff0000';
        passageVert.style.transition = 'background 2s ease-in-out';
        divConnect.style.background = '#ff0000';
        divConnect.style.transition = 'background 2s ease-in-out';
    }
  }
}
/* 00ff00 = vert; 00A4FF = bleu ciel; ff0000 = red (red)

//DICI
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    
    const options: ChartConfiguration['options'] = {
      scales: {
        x: {
          title: {
            display: true,
            text: "Temps (en heure)"
          },
          type: "timeseries",
          position: "bottom",
          time: {
            parser: "YYYY-MM-DD HH:mm:ss",
            tooltipFormat: "ll HH:mm:ss"
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
            source: "auto"
          },
          adapters: {
            date: {
              locale: "fr"
            }
          }
        },
        y: {
          title: {
            display: true,
            text: "Température (en degrés)"
          },
          type: "linear",
          position: "left"
        }
      }
    };
  }

let temperature = 20; // initial temperature value
    let lastUpdate = 0; // initial last update value
    let chartData: any[] = []; // Initialize an empty array for chart data
    
    if (ctx) {
      this.myChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Relevé température',
              data: (() => chartData)(),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: options,
      });
    } else {
      console.error('Failed to get canvas context');
    } 

    const updateChart = () => {
      if (this.degre !== undefined && this.derniereActuFinal !== undefined) {
        chartData.push({ x: new Date(this.derniereActuFinal), y: this.degre });
        this.myChart.data.datasets[0].data = (() => chartData)();
        this.myChart.update();
      }
    }
    setInterval(updateChart, 1000); // Update the chart every 1 second (to match the API call interval)   
  }   

*/