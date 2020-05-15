import * as React from "react";
import {useState} from "react";
import cytoscape, {ElementDefinition, ElementGroup} from "cytoscape";
import cola from "cytoscape-cola";

import {GraphData} from "./Model";


const styles = [
    {
        selector: "node",
        style: {
            "transition-duration": "0.3s",
            "label": "data(id)",
            "font-weight": "bold",
            "transition-timing-function": "ease-in-sine",
            "background-color": "orange"
        }
    },
    {
        selector: "edge",
        style: {
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "target-arrow-color": "purple",
            "line-color": "lightblue"
        }
    }
];

function mapToCytoscapeGrapData(data: GraphData): ElementDefinition[] {
    const nodes: ElementGroup = "nodes";
    const edges: ElementGroup = "edges";
    let a: ElementDefinition[] = data.links.map(it => ({
        group: edges,
        data: {id: `edge-${it.source}-${it.target}`, source: it.source, target: it.target}
    }));
    let b: ElementDefinition[] = data.nodes.map(it => ({group: nodes, data: it}));
    return a.concat(b);
}

enum LayoutType {
    GRID = "grid",
    CONCENTRIC = "concentric",
    CIRCLE = "circle"
}

interface State {
    layout: LayoutType
}

export default function CytoscapeGraph(props: {
    data: GraphData,
    onLinkClick: (from: string, to: string) => void
}) {
    const [state, setState] = useState<State>({layout: LayoutType.GRID})
    const container = React.useRef<HTMLDivElement>(null);
    const graph = React.useRef<cytoscape.Core>();
    const layout = React.useRef<cytoscape.Layouts>();
    const {data, onLinkClick} = props;
    const convertedData = mapToCytoscapeGrapData(data);
    React.useEffect(() => {
        if (graph.current) {
            if (layout.current) {
                layout.current.stop();
            }
            graph.current.remove('node, edge');
            graph.current.add(convertedData);
            layout.current = graph.current.elements().makeLayout({
                name: state.layout,
                spacingFactor: 2
            });
            layout.current.run();
        }
        // eslint-disable-next-line
    }, [data, state.layout,]);

    React.useEffect(() => {
        if (!container.current) {
            return;
        }
        if (!graph.current) {
            cytoscape.use(cola);
            // @ts-ignore
            graph.current = cytoscape({
                style: styles,
                elements: convertedData,
                maxZoom: 1,
                wheelSensitivity: 0.2,
                container: container.current
            });
            graph.current?.on("click", "edge", (it: any) => {
                let edge = it.target._private.data;
                onLinkClick(edge.source, edge.target);
            });
        }
        // eslint-disable-next-line
    }, [data, onLinkClick]);

    const updateLayout = (layout: LayoutType) => {
        setState(s => ({...s, layout: layout}));
    };

    return (
        <>
            <div className="select">
                <select value={state.layout} onChange={(e) => updateLayout(e.target.value as LayoutType)}>
                    {Object.values(LayoutType).map((val: string) => <option key={val}>{val}</option>)}
                </select>
            </div>
            <div className="graph" ref={container}/>
        </>
    );
}

