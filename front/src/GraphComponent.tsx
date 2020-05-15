import {GraphData, GraphType} from "./Model";
import {Graph} from "react-d3-graph";
import {graphConfig} from "./Config";
import React from "react";
import VisGraphWrapper from './VisGraphWrapper';
import CytoscapeGraph from './CytoscapeGraph';

export interface Props {
    graphType: GraphType,
    data: GraphData,
    onLinkClick: (from: string, to: string) => void
}

export function GraphComponent(props: Props) {
    let graph = (() => {
        if (props.data.nodes.length === 0) {
            return undefined
        }
        switch (props.graphType) {
            case GraphType.CYTOSCAPE:
                return <CytoscapeGraph onLinkClick={props.onLinkClick} data={props.data}/>;
            case GraphType.VIS:
                return <VisGraphWrapper data={props.data} onLinkClick={props.onLinkClick}/>;
            case GraphType.D3:
                return <Graph
                    id="cycle-graph"
                    data={props.data}
                    config={graphConfig}
                    onClickLink={props.onLinkClick}/>;
        }
    })();
    return (
        <div
            style={{border: "black", borderWidth: 1, borderStyle: "dashed"}}>
            {graph}
        </div>
    );
}