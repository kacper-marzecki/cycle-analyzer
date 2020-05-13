import React, {useEffect, useState} from 'react';
import './App.css';
import 'bulma/css/bulma.css'
import {Navbar} from "./Navbar";
import {Graph} from "react-d3-graph";
import {getCompleteGraph, getCycleList, getGraphForCycle, getImportsFromTo} from "./ApiClient";
import {CycleList, GraphData, ImportInfo, Package} from "./Model";
import {graphConfig} from "./Config";

interface State {
    cycles: CycleList,
    graphData: GraphData,
    description: Array<ImportInfo>
}

function App() {
    let [state, setState] = useState<State>({
        cycles: [],
        graphData: {nodes: [], links: []},
        description: []
    })
    useEffect(() => {
        getCycleList().then(_ => setState(s => ({...s, cycles: _})))
    }, [])

    const onClickLink = (source: string, target: string) => {
        const pairs = state.graphData.links.find(_ => _.source === target && _.target === source) === undefined
            ? [[source, target]]
            : [[target, source], [source, target]];
        const promises = pairs.map(_ => getImportsFromTo(_[0], _[1]));
        Promise.all(promises)
            .then(_ => setState({
                ...state,
                description: _.map(it => ({from: it.from, to: it.to, imports: it.imports}))
            }));
    };

    const constructGraphDataFromPackages = (packages: Array<Package>): GraphData => {
        return {
            nodes: packages.map(_ => ({id: _.name})),
            links: packages.flatMap(p => p.uses.map(_ => ({source: p.name, target: _})))
        };
    }

    const cycleClicked = (cycleIndex: number) => {
        getGraphForCycle(cycleIndex)
            .then(constructGraphDataFromPackages)
            .then(_ => setState({...state, graphData: _}))
    }

    function cycleList(cycles: CycleList): JSX.Element[] {
        return cycles.map((it, index) => <a
                        key={index}
                        href="/#"
                        className="list-item"
                        onClick={_ => cycleClicked(index)}>
                        {it.length} item cycle
                    </a>
                )
    }

    const showCompleteGraphClicked = () => {
        getCompleteGraph()
            .then(constructGraphDataFromPackages)
            .then(_ => setState({...state, graphData: _}))
    }

    return (
        <div className="App">
            <Navbar/>
            <div className="">
                <div className="columns is-marginless">
                    <div className="column is-one-fifth">
                        <div className="list">
                            <a
                                key="complete-graph"
                                href="/#"
                                className="list-item"
                                onClick={_ => showCompleteGraphClicked()}>
                                Complete dependency graph
                            </a>
                            {cycleList(state.cycles)}
                        </div>
                    </div>
                    <div className="column">
                        {state.graphData.nodes.length === 0
                            ? undefined
                            : <div style={{border: "black", borderWidth: 1, borderStyle: "dashed"}}>
                                <Graph
                                    id="cycle-graph"
                                    data={state.graphData}
                                    config={graphConfig}
                                    onClickLink={onClickLink}/>
                            </div>
                        }
                    </div>
                </div>
                <div className="columns" style={{marginLeft: "auto"}}>
                    {state.description.map(_ => <div className="column">
                        <table className="table">
                            <thead>
                            <tr>
                                <th className="has-text-centered">{`${_.to} imports in ${_.from}`}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {_.imports.map(i => <tr className="has-text-left">{i}</tr>)}
                            </tbody>
                        </table>
                    </div>)}
                </div>
            </div>
        </div>
    );
}

export default App;
