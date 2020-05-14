export interface ImportInfo {
    from: string,
    to: string,
    imports: Array<string>
}

export interface Package {
    name: string,
    uses: Array<string>
}

export interface Cycle {
    packages: Array<string>,
    new_cycle: boolean,
    id: number
}

export type CycleList = Array<Cycle>;

export interface GraphData {
    nodes: Array<{ id: string }>,
    links: Array<{ source: string, target: string }>
}