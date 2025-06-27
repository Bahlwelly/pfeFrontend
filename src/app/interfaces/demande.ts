export interface Demande {
    id : string;
    user_id : string;
    commune : string;
    horaires : string;
    carte_identite : string;
    casier_judiciaire : string;
    extrait_naissance : string;
    rendez_vous : Date;
    temps_creation : Date;

    [key: string]: any;
}

