import {
    Component,
    computed,
    inject,
    signal
} from '@angular/core';

import {
    CommonModule,
    CurrencyPipe
} from '@angular/common';

import { FormsModule } from '@angular/forms';

import { VentaPorCategoria } from '../../models/reporte.model';
import { ReporteService } from '../../services/reporte-service';

@Component({
  selector: 'app-ventas-categoria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe
  ],
  templateUrl: './ventas-categoria.html',
  styleUrl: './ventas-categoria.css'
})
export class VentasCategoria {

  private readonly reporteService =
    inject(ReporteService);

  readonly desde = signal('');
  readonly hasta = signal('');

  readonly resultados =
    signal<VentaPorCategoria[]>([]);

  readonly cargando = signal(false);
  readonly error = signal('');

  readonly totalUnidades = computed(() =>
    this.resultados()
      .reduce(
        (acumulado, item) =>
          acumulado + item.cantidadVendida,
        0
      )
  );

  readonly totalMonto = computed(() =>
    this.resultados()
      .reduce(
        (acumulado, item) =>
          acumulado + Number(item.montoTotal),
        0
      )
  );

  readonly montoMayor = computed(() => {

    const lista = this.resultados();

    if (lista.length === 0) {
      return 0;
    }

    return Math.max(
      ...lista.map(
        item => Number(item.montoTotal)
      )
    );
  });

  constructor() {
    this.generar();
  }

  cambiarDesde(valor: string): void {
    this.desde.set(valor);
  }

  cambiarHasta(valor: string): void {
    this.hasta.set(valor);
  }

  generar(): void {

    this.error.set('');

    if (
      this.desde() &&
      this.hasta() &&
      this.desde() > this.hasta()
    ) {
      this.error.set(
        'La fecha «desde» no puede ser posterior a la fecha «hasta».'
      );

      return;
    }

    this.cargando.set(true);

    this.reporteService
      .ventasPorCategoria(
        this.desde() || null,
        this.hasta() || null
      )
      .subscribe({

        next: respuesta => {

          this.resultados.set(
            Array.isArray(respuesta)
              ? respuesta
              : []
          );

          this.cargando.set(false);
        },

        error: err => {

          this.error.set(
            err?.error?.message ??
            'No se pudo generar el reporte.'
          );

          this.resultados.set([]);
          this.cargando.set(false);
        }
      });
  }

  limpiar(): void {

    this.desde.set('');
    this.hasta.set('');
    this.error.set('');

    this.generar();
  }

  porcentaje(
    item: VentaPorCategoria
  ): number {

    const mayor = this.montoMayor();

    if (mayor <= 0) {
      return 0;
    }

    return (
      Number(item.montoTotal) /
      mayor
    ) * 100;
  }
}