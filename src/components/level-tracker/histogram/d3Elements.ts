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

    return { svg };
}

export function createLine(type:string, svg: SVGSVGElement | null, data: any[], x: any): LineObject {
    const line = d3.lineRadial<[number, number]>()
        .curve(d3.curveCatmullRom)
        .angle(d => x(d[0]));

    const path = d3.select(svg)
        .append("path")
        .attr("fill", "none")
        .attr("stroke", `${(type === "RMS" ? "purple" : "blue")}`)
        .attr("stroke-width", 2.5)
        .attr("d", line(
            data.map(d => [d.time, type === "RMS" ? d.RMS : d.LUFS])
        ));

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

export function updateLine(type: "RMS" | "LUFS", object: LineObject, data: any[], yOffset: number) {
    object.path.attr("d", object.line(
        data.filter(d => d.LUFS >= -100)
            .map(d => [d.time, (type === "RMS" ? d.RMS : d.LUFS) + yOffset])
    ));
}

export function updateNeedle(needle: any, angle: number) {
    needle.attr("transform", `rotate(${angle * (180 / Math.PI)})`);
}

export function resetLines(histogram: SVGSVGElement) {
    d3.select(histogram)  
        .selectAll("path")  
        .attr("d", "");
}
