import * as d3 from "d3";

export type LineObject = {
    line: d3.LineRadial<[number, number]>;
    path: d3.Selection<SVGPathElement, unknown, null, undefined>;
};

export function createHistogram(svgElement: SVGSVGElement, data: any[], width: number, height: number, innerRadius: number, outerRadius: number, x: any, y: any) {
    const svg = d3.select(svgElement)
        .attr("width", width)
        .attr("height", height)
        .style("background", "grey")
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "width: 100%; height: auto;")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");
        
    svg.append("g")
        .selectAll()
        .data(y.ticks())
        .join("g")
        .call(g => g.append("circle")
            .attr("fill", "none")
            .attr("stroke", "currentColor")
            .attr("stroke-opacity", 0.1)
            .attr("r", y));

    d3.selectAll("circle")
        .filter((d, i, nodes) => i === 0)  
        .attr("fill", "#1c1e30")
        .attr("stroke", "#afb0be")
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 1)

    d3.selectAll("circle")
        .filter((d, i, nodes) => i === 10)  
        .attr("stroke", "#afb0be")
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 1)

    const defs = svg.append("defs");

    defs.append("filter")
        .attr("id", "blur")
        .append("feGaussianBlur")
        .attr("stdDeviation", 2); 

    return { svg };
}

export function createLine(type:string, svg: SVGSVGElement | null, data: any[], x: any, color: string): LineObject {
    const line = d3.lineRadial<[number, number]>()
        .curve(d3.curveCatmullRom)
        .angle(d => x(d[0]));

    const path = d3.select(svg)
        .append("path")
        .attr("id", `${type}-path`)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr('marker-start', 'url(#dot)')
        .attr('marker-mid', 'url(#dot)')
        .attr('marker-end', 'url(#dot)')
        .attr("d", line(
            data.map(d => [d.time, type === "RMS" ? d.RMS : d.LUFS])
        ))
        .attr("filter", "url(#blur)")

    return { line, path };
}

export function createNeedles(svg: any, outerRadius: number) {
    const needle = svg.append("line")
        .attr("x1", 0)
        .attr("y1", -50)
        .attr("x2", 0)
        .attr("y2", -outerRadius)
        .attr("stroke", "#afb0be")
        .attr("stroke-width", 1.5);

    const firstNeedle = svg.append("line")
        .attr("x1", 0)
        .attr("y1", -50)
        .attr("x2", 0)
        .attr("y2", -outerRadius)
        .attr("stroke", "#afb0be")
        .attr("stroke-width", 1.5);

    return { needle, firstNeedle };
}

export function updateLine(
    svg: any,
    type: "RMS" | "LUFS",
    object: LineObject,
    data: any[],
    yOffset: number,
    scaleFactor: number,
    level: number | null,
) {
    if (!svg) return;
    
    const lineData: [number, number][] = data
        .filter(d => d.LUFS >= -100)
        .map(d => {
            const xCoord = d.time / scaleFactor;
            const yCoord = (type === "RMS" ? d.RMS : d.LUFS) + yOffset;
            return [xCoord, yCoord];
        });

    object.path.attr("d", object.line(lineData));

    const pathNode = object.path.node();
    const pathLength = pathNode.getTotalLength();
    const lastPoint = pathNode.getPointAtLength(pathLength);

    svg.append("circle")
        .attr("class", "path-point")
        .attr("cx", lastPoint.x)
        .attr("cy", lastPoint.y)
        .attr("r", 4)
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", function () {
            d3.select(`#${type}-path`)
                .attr("stroke", "orange")  
                .attr("stroke-width", 3);  

            d3.select(`.instant-level__${type}-value`)
                .text(`${Math.floor(level)}`);
        })
        .on("mouseout", function () {
            d3.select(`#${type}-path`)
                .attr("stroke", "#c837c8")  
                .attr("stroke-width", 2);  

            d3.select(`.instant-level__${type}-value`)
                .text("0");
        });   
}

export function updateNeedle(needle: any,angle: number) {
    needle.attr("transform", `rotate(${angle * (180 / Math.PI)})`);
}

export function resetLines(histogram: SVGSVGElement) {
    d3.select(histogram)  
        .selectAll("path")  
        .attr("d", "path-point");
    
    d3.select("circle").remove();
}
