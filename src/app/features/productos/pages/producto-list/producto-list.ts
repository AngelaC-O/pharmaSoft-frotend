import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css',
})
export class ProductoList implements OnInit {
  readonly categoriaId = input<string>();

  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);

  readonly productos = signal<any[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly categoriaSeleccionada = signal<number | null>(null);

  ngOnInit(): void {
    const id =
      this.categoriaId() ??
      this.route.snapshot.queryParamMap.get('categoriaId');

    const categoriaId = id ? Number(id) : null;
    this.categoriaSeleccionada.set(categoriaId);

    this.http.get<any>('http://localhost:8080/api/v1/productos').subscribe({
      next: (respuesta) => {
        const lista = Array.isArray(respuesta)
          ? respuesta
          : respuesta.content ?? [];

        const productosFiltrados = categoriaId
          ? lista.filter(
              (producto: any) =>
                Number(
                  producto.categoriaId ?? producto.categoria?.id,
                ) === categoriaId,
            )
          : lista;

        this.productos.set(productosFiltrados.slice(0, 100));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos.');
        this.cargando.set(false);
      },
    });
  }
}