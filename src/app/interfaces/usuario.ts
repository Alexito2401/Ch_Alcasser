export interface Usuario {
  uid: string;
  email: string;
  displayName?: string;
  newUser?: boolean;
  edad?: number;
}

export interface Partido {
  uid: string;
  equipoL: string;
  equipoV: string;
  golesL: number;
  golesV: number;
  fecha: string;
  categoria: Categoria;
  estado: Estado;
  stats? : Stats;
}

export interface Equipo {
  uid: string;
  categoria?: Categoria;
  jugadores: Jugador[];
  partidos?: Partido[];
  Entrenador: Usuario;
}

export interface Jugador extends Usuario {
  posicion?: string;
  equipo?: Equipo[];
  partidos?: Partido[];
  categoria?: Categoria;
}

export interface Stats{
  perdidas : number;
  recuperadas : number;
  tiros : number;
  tarjetasA: number;
  tarjetasR: number;
}

export enum Estado {
  suspendido = "suspendido",
  completado = "completado",
  pendiente = "pendiente",
  aplazado = "aplazado",
}

export enum Categoria {
  benjamin = "benjamin",
  alevin = "alevin",
  infantilF = "infantil F",
  infantilM = "infantil M",
  cadeteF = "cadete F",
  cadeteM = "cadete M",
  Juvenil = "juvenil",
  SeniorA = "senior A",
  SeniorB = "senior B"
}
