import VisGraph from "react-graph-vis";
import React from "react";
import {GraphData} from "./Model";

const options = {
    physics: {
        enabled: false,
        repulsion: {
            nodeDistance: 500
        }
    },
    layout: {
        improvedLayout: true,
    },
    edges: {
        color: "#000000"
    },
    height: "500px"
};


type VisGraphData = {
    nodes: Array<{ id: string, label: string, title: string }>,
    edges: Array<{ id: string, from: string, to: string }>
}

function mapToVisGraphData(data: GraphData): VisGraphData {
    return {
        nodes: data.nodes.map(it => ({id: it.id, label: it.id, title: it.id})),
        edges: data.links.map(it => ({id: `${it.source};${it.target}`, from: it.source, to: it.target}))
    }
}

export default function VisGraphWrapper(props: {
    data: GraphData,
    onLinkClick: (from: string, to: string) => void
}) {
    const events = {
        select: function (event: { nodes: Array<string>, edges: Array<String>, event: any }) {
            event.event.preventDefault();
            if (event.edges.length === 1) {
                let [from, to] = event.edges[0].split(";");
                props.onLinkClick(from, to);
            }
        }
    };
    return (<VisGraph
        key={JSON.stringify(props.data)}
        graph={mapToVisGraphData(props.data)}
        options={options}
        events={events}
    />)
}