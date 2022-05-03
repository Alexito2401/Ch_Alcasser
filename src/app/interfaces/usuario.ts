export interface Usuario {
  uid: string;
  email: string;
  nombre?: string;
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
  jugadores: string[];
  partidos?: Partido[];
  Entrenador: Usuario;
}

export interface Jugador extends Usuario {
  posicion?: Posicion;
  equipo?: string[];
  partidos?: Partido[];
  categoria?: Categoria;
}

export interface Stats{
  perdidas : number;
  recuperadas : number;
  tiros: number;
  paradas : number;
  tarjetasA?: number;
  tarjetasR?: number;
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
  cadete = "cadete",
  Juvenil = "juvenil",
  SeniorA = "senior A",
  SeniorB = "senior B"
}

export enum Posicion {
  extremoD = "extremo derecho",
  extremoI = "extremo izquierdo",
  lateralD = "lateral derecho",
  lateralI = "lateral izquierdo",
  central = "central",
  pibote = "pibote",
  portero = "portero",
}
