export interface User {
    id : string;
    name : string;
    nni : number;
    tel : number;
    signal : number;
    commune : string;
    blocquee : string;
    role : 'CHEF' | 'CITOYEN';
    
    [key: string]: any;
}
