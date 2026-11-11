import { Injectable } from '@angular/core';
import { collection, doc, onSnapshot, writeBatch } from 'firebase/firestore';
import { firebaseDb } from './firestore';
import { PlannerData } from './models';

/** Datos del navegador: los usa el modo invitado (demo sin cuenta). */
@Injectable({ providedIn: 'root' })
export class LocalPlannerStorage {
  private readonly key = 'paper-planner:v1';

  load(): PlannerData | null {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return null;
      const data = JSON.parse(raw) as PlannerData;
      return data?.version === 1 ? data : null;
    } catch {
      return null;
    }
  }

  /** Devuelve false si no se pudo guardar (p. ej. almacenamiento lleno). */
  save(data: PlannerData): boolean {
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
      return true;
    } catch {
      // Almacenamiento bloqueado o lleno: la app sigue funcionando en memoria.
      return false;
    }
  }
}

/**
 * Datos de cada cuenta en Firestore:
 *
 *   users/{uid}/planner/data      → todo menos las imágenes
 *   users/{uid}/dayImages/{fecha} → { data: imagen } (una por documento, por el límite de 1 MB)
 */
@Injectable({ providedIn: 'root' })
export class CloudPlannerStorage {
  private readonly db = firebaseDb();

  /**
   * Escucha los datos de la cuenta, también los cambios hechos desde otro dispositivo.
   * `onData(null)` = la cuenta todavía no tiene datos guardados.
   * Ignora el eco de los cambios propios que aún no confirma el servidor.
   */
  watch(uid: string, onData: (data: PlannerData | null) => void, onError: (e: unknown) => void): () => void {
    let planner: Omit<PlannerData, 'dayImages'> | null | undefined;
    let images: Record<string, string> | undefined;

    const emit = () => {
      if (planner === undefined || images === undefined) return;
      onData(planner ? { ...planner, dayImages: images } : null);
    };

    const stopPlanner = onSnapshot(
      this.plannerDoc(uid),
      { includeMetadataChanges: false },
      (snap) => {
        if (snap.metadata.hasPendingWrites) return;
        // "No existe" según la copia local no es definitivo: se espera la respuesta del servidor.
        if (!snap.exists() && snap.metadata.fromCache) return;
        planner = snap.exists() ? (snap.data() as Omit<PlannerData, 'dayImages'>) : null;
        emit();
      },
      onError,
    );
    const stopImages = onSnapshot(
      collection(this.db, 'users', uid, 'dayImages'),
      (snap) => {
        if (snap.metadata.hasPendingWrites) return;
        images = Object.fromEntries(snap.docs.map((d) => [d.id, d.get('data') as string]));
        emit();
      },
      onError,
    );
    return () => {
      stopPlanner();
      stopImages();
    };
  }

  /**
   * Guarda el calendario. Las imágenes solo se escriben si cambiaron respecto a `previous`.
   * La promesa se resuelve cuando el servidor confirma (sin internet queda pendiente y
   * Firestore la envía al volver la conexión).
   */
  save(uid: string, data: PlannerData, previous: PlannerData | null): Promise<void> {
    const { dayImages = {}, ...planner } = data;
    const before = previous?.dayImages ?? {};
    const batch = writeBatch(this.db);
    batch.set(this.plannerDoc(uid), planner);
    for (const [date, image] of Object.entries(dayImages)) {
      if (before[date] !== image) batch.set(this.imageDoc(uid, date), { data: image });
    }
    for (const date of Object.keys(before)) {
      if (!(date in dayImages)) batch.delete(this.imageDoc(uid, date));
    }
    return batch.commit();
  }

  private plannerDoc(uid: string) {
    return doc(this.db, 'users', uid, 'planner', 'data');
  }

  private imageDoc(uid: string, date: string) {
    return doc(this.db, 'users', uid, 'dayImages', date);
  }
}
