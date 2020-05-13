export interface ImportInfo {
    from: string,
    to: string,
    imports: Array<string>
}

export interface Package {
    name: string,
    uses: Array<string>
}

export type CycleList = Array<Array<string>>;

export interface GraphData {
    nodes: Array<{ id: string }>,
    links: Array<{ source: string, target: string }>
}