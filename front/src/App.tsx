import React, {useEffect, useState} from 'react';
import './App.css';
import 'bulma/css/bulma.css'
import {Navbar} from "./Navbar";
import {Graph} from "react-d3-graph";
import {getCompleteGraph, getCycleList, getGraphForCycle, getImportsFromTo} from "./ApiClient";
import {CycleList, GraphData, ImportInfo, Package} from "./Model";
import {graphConfig} from "./Config";
import {GraphComponent} from "./GraphComponent";

interface State {
    cycles: CycleList,
    graphData: GraphData,
    description: Array<ImportInfo>,
    show_only_new_cycles: boolean
}

function App() {
    let [state, setState] = useState<State>({
        cycles: [],
        graphData: {nodes: [], links: []},
        description: [],
        show_only_new_cycles: false
    });

    useEffect(() => {
        getCycleList().then(_ => setState(s => ({...s, cycles: _})))
    }, [])

    const toggle_show_only_new_cycles = () => {
        setState(s => ({...s, show_only_new_cycles: !s.show_only_new_cycles}))
    }

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

    function cycleList(cycles: CycleList, showOnlyNewCycles: boolean): JSX.Element[] {
        return cycles
            .filter(it => showOnlyNewCycles ? it.new_cycle : true)
            .map((it ) => <a
                    key={it.id}
                    href="/#"
                    className="list-item"
                    onClick={_ => cycleClicked(it.id)}>
                    {it.packages.length} item cycle
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
                        <div className="field">
                            <input
                                type="checkbox"
                                checked={state.show_only_new_cycles}
                                onChange={_ => toggle_show_only_new_cycles()}
                            />
                            <label>Show only new cycles</label>
                        </div>
                        <div className="list">
                            <a
                                key="complete-graph"
                                href="/#"
                                className="list-item"
                                onClick={_ => showCompleteGraphClicked()}>
                                Complete dependency graph
                            </a>
                            {cycleList(state.cycles, state.show_only_new_cycles)}
                        </div>
                    </div>
                    <div className="column">
                        {state.graphData.nodes.length === 0
                            ? undefined
                            : <GraphComponent
                                graphType={1}
                                data={state.graphData}
                                onLinkClick={onClickLink}/>
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
