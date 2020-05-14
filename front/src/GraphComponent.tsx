import {GraphData} from "./Model";
import {Graph} from "react-d3-graph";
import {graphConfig} from "./Config";
import React, {Component} from "react";
import DirectGraph from "react-direct-graph";
import {INodeInput} from "react-direct-graph/dist";

export interface Props {
    graphType: 1 | 2,
    data: GraphData,
    onLinkClick: (from: string, to: string) => void
}

const CustomNodeIcon = (props: {node: any, incomes: any})=> {
        return (
            <div>{JSON.stringify(props.node)}</div>
        );
}
function mapToGraph2(data: GraphData): Array<INodeInput<undefined>> {
    const targets = data.links.reduce(((acc, link) => {
        let targets = (acc.get(link.source) || []).concat([link.target]);
        acc.set(link.source, targets);
        return acc;
    }), new Map<string, Array<string>>());
    const a =  data.nodes.map(node => {
        return {
            id: node.id,
            next: targets.get(node.id) || [],
            payload: undefined
        }
    });
    return a;
}

export function GraphComponent(props: Props) {
    let graph = props.graphType === 2
        ? <Graph
            id="cycle-graph"
            data={props.data}
            config={graphConfig}
            onClickLink={props.onLinkClick}/>
        :  <DirectGraph list={mapToGraph2(props.data)} cellSize={300} padding={100} component={CustomNodeIcon} />;

    return (
        <div
            style={{border: "black", borderWidth: 1, borderStyle: "dashed"}}>
            {graph}
        </div>
    );
}