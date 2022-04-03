export interface Usuario {
    uid: string;
    email: string;
    displayName: string;
    newUser: boolean;
}

export interface Partido {
    uid: string;
    equipoL: string;
    equipoV: string;
    golesL: number;
    golesV: number;
}

export interface Equipo {
    uid: string;
    categoria: string;
    jugadores: Jugador[];
    partidos?: Partido[];
    Entrenador: Usuario;
}

export interface Jugador extends Usuario {
    posicion?: string;
    equipo?: Equipo[];
    partidos?: Partido[];
}