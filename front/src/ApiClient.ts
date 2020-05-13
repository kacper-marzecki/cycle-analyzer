import Axios, {AxiosResponse} from "axios";
import {CycleList, ImportInfo, Package} from "./Model";

function extractData<T>(response: AxiosResponse<T>): T {
    return response.data;
}

export function getCycleList(): Promise<CycleList> {
    return Axios.get<CycleList>("/cycles").then(extractData);
}

export function getGraphForCycle(cycleId: number): Promise<Array<Package>> {
    return Axios.get<Array<Package>>(`/cycle/${cycleId}`).then(extractData);
}

export function getImportsFromTo(from: string, to: string): Promise<ImportInfo> {
    return Axios.get<ImportInfo>(`/imports/${from}/${to}`).then(extractData);
}

export function getCompleteGraph(): Promise<Array<Package>> {
    return Axios.get<Array<Package>>("/graph").then(extractData);
}

