import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PaginaResponse } from '../../../core/models/pagina-response';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/productos`;

  listar(
    pagina = 0,
    tamanio = 20,
    ordenarPor = 'nombre',
    direccion: 'asc' | 'desc' = 'asc'
  ): Observable<PaginaResponse<Producto>> {

    const params = new HttpParams()
      .set('pagina', pagina)
      .set('tamanio', tamanio)
      .set('ordenarPor', ordenarPor)
      .set('direccion', direccion);

    return this.http.get<any>(this.url, { params }).pipe(
      map(respuesta => {

        const contenido: Producto[] =
          Array.isArray(respuesta)
            ? respuesta
            : respuesta.contenido ?? respuesta.content ?? [];

        return {
          contenido,
          pagina: respuesta?.pagina ?? respuesta?.number ?? 0,
          tamanio: respuesta?.tamanio ?? respuesta?.size ?? contenido.length,
          totalElementos:
            respuesta?.totalElementos ??
            respuesta?.totalElements ??
            contenido.length,
          totalPaginas:
            respuesta?.totalPaginas ??
            respuesta?.totalPages ??
            1,
          primera:
            respuesta?.primera ??
            respuesta?.first ??
            true,
          ultima:
            respuesta?.ultima ??
            respuesta?.last ??
            true
        };

      })
    );
  }

  obtener(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }
}