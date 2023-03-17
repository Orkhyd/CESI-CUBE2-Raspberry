import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ChartData {
  name: string;
  values: number[];
}

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.scss']
})
export class GraphComponentComponent implements OnInit, OnDestroy {
  derniereActu?: string;
  options: any;
  updateOptions: any;

  private oneDay = 24 * 3600 * 1000;
  private now!: Date;
  private value!: number;
  //private data!: ChartData[];
  private timer: any;
  private data!: [number, number][];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    setInterval(async () => {
      try {
        const response = await this.http.get<any>("http://140.238.217.125:3000/recordings/last", { observe: 'response' }).toPromise();
        if (response?.status === 200) {
          try {
            //recuperer les data ici
            const jsonData = response.body[0];
            const degre = jsonData.temperature;
            const dateuh = new Date(jsonData.timeStamp);
            const day = dateuh.getDate().toString().padStart(2, "0");
            const month = (dateuh.getMonth() + 1).toString().padStart(2, "0");
            const year = dateuh.getFullYear();
            const heure = dateuh.getHours().toString().padStart(2, "0");
            const minute = dateuh.getMinutes().toString().padStart(2, "0");
            const seconde = dateuh.getSeconds().toString().padStart(2, "0");
            const derniereActuFinal = `${day}/${month}/${year} à ${heure}:${minute}:${seconde}`;
            if (this.derniereActu === derniereActuFinal) {
              console.log('Cest la même chose que la derniere fois');
            } else {
              this.data.shift();
              console.log('Cest pas la même date donc actu donnée');
            }
            this.derniereActu = derniereActuFinal;
            console.log('Dernière actualisation : ' + this.derniereActu + ', et nouvelle actualisation : ' + derniereActuFinal);
          } catch (error) {
            console.log("Impossible de récupérer les données. Error: " + error);
          }
        } else {
          console.log("Code de statut : " + response?.status);
        }
      } catch (error) {
        console.log("Impossible de se connecter au serveur. Error: " + error);
      }
    }, 12000); //Essaye de se connecter pour récupérer les données toutes les 6s (10x par minute)


    // generate some random testing data:
    this.data = [];
    this.now = new Date(1997, 9, 3);
    this.value = 0;

    for (let i = 0; i < 1000; i++) {
      this.data.push([15, 30]);
    }

    // initialize chart options:
    this.options = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          params = params[0];
          const date = new Date(params.name);
          return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [{
        name: 'Mocking Data',
        type: 'line',
        showSymbol: false,
        emphasis: {
          line: false,
        },
        data: this.data
      }]
    };

    // Mock dynamic data:
    this.timer = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        this.data.shift();
        this.data.push(this.randomData());
      }

      // update series data:
      this.updateOptions = {
        series: [{
          data: this.data
        }]
      };
    }, 12000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  randomData(): [number, number] {
    this.now = new Date(this.now.getTime() + this.oneDay);
    this.value = 0;
    const date = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate());
    return [
      date.getTime(),
      Math.round(this.value)
    ];
  }
}