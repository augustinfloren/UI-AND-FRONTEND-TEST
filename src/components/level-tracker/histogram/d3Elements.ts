import * as d3 from "d3";

export function createHistogram(svgElement: SVGSVGElement, data: any[], width: number, height: number, innerRadius: number, outerRadius: number, x: any, y: any) {
    const svg = d3.select(svgElement)
        .attr("width", width)
        .attr("height", height)
        .style("background", "grey")
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "width: 100%; height: auto;")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");

    const line = d3.lineRadial<[number, number]>()
        .curve(d3.curveCatmullRom)
        .angle(d => x(d[0]));

    const RMSpath = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-width", 2.5)
        .attr("d", line(
            data.filter(d => d.time !== null && d.level !== null)
                .map(d => [d.time!, d.level!])
        ));
        
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

    return { svg, RMSpath, line };
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

export function updateRMSPath(RMSpath: any, data: any[], line: any) {
    RMSpath.attr("d", line(
        data.filter(d => d.time !== null && d.level !== null)
            .map(d => [d.time!, d.level!])
    ));
}

export function updateNeedle(needle: any, angle: number) {
    needle.attr("transform", `rotate(${angle * (180 / Math.PI)})`);
}
