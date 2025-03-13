/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import type { AttackData } from "@/lib/types";
import * as d3 from "d3";

interface AttackGraphProps {
  data: AttackData;
}

interface Node {
  id: string;
  group: number;
  url?: string;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

export default function AttackGraph({ data }: AttackGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Transform data into nodes and links
    const nodes: Node[] = [];
    const links: Link[] = [];

    // Add root node
    nodes.push({ id: "MITRE ATT&CK", group: 0 });

    // Add tactic nodes and connect to root
    Object.keys(data).forEach((tactic) => {
      nodes.push({ id: tactic, group: 1 });
      links.push({ source: "MITRE ATT&CK", target: tactic, value: 1 });

      // Add technique nodes and connect to tactics
      data[tactic].forEach((technique) => {
        const [name, url] = Object.entries(technique)[0];
        nodes.push({ id: name, group: 2, url: url as string });
        links.push({ source: tactic, target: name, value: 1 });
      });
    });

    const width = svgRef.current.clientWidth;
    const height = 600;

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(120) // Increased spacing
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Define arrow marker
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 18)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // Create links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", (d: any) => Math.sqrt(d.value))
      .attr("marker-end", "url(#arrowhead)");

    // Create node groups
    const node = svg
      .append("g")
      .selectAll(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any
      );

    // Add circles to nodes with increased sizes
    node
      .append("circle")
      .attr("r", (d: any) => (d.group === 0 ? 30 : d.group === 1 ? 20 : 15)) // Bigger nodes
      .attr("fill", (d: any) => {
        if (d.group === 0) return "#e53e3e"; // Root node (red)
        if (d.group === 1) return "#dd6b20"; // Tactics (orange)
        return "#3182ce"; // Techniques (blue)
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add text labels to nodes with bigger font sizes
    node
      .append("text")
      .attr("dx", (d: any) => (d.group === 0 ? 35 : d.group === 1 ? 25 : 20))
      .attr("dy", ".35em")
      .text((d: any) => d.id)
      .attr("font-size", (d: any) =>
        d.group === 0 ? "18px" : d.group === 1 ? "16px" : "14px"
      ) // Bigger text
      .attr("fill", "#333")
      .attr("font-weight", "bold");

    // Click handler for technique nodes
    node.on("click", (event: any, d: any) => {
      if (d.url) {
        window.open(d.url, "_blank");
      }
    });

    // Add hover effect
    node
      .on("mouseover", function () {
        d3.select(this)
          .select("circle")
          .attr("stroke", "#000")
          .attr("stroke-width", 3);
      })
      .on("mouseout", function () {
        d3.select(this)
          .select("circle")
          .attr("stroke", "#fff")
          .attr("stroke-width", 2);
      });

    // Tooltip on hover
    node.append("title").text((d: any) => d.id);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup function
    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div className="w-full h-[600px] overflow-hidden border border-gray-300 rounded-lg">
      <svg ref={svgRef} width="100%" height="100%" className="bg-white"></svg>
    </div>
  );
}
