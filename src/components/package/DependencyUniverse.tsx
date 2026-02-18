import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph3D, { GraphData, NodeObject } from 'react-force-graph-3d';
import { PackageManifest } from '@/types/package';
import { useNavigate } from '@tanstack/react-router';
import { useTheme } from '@/components/ThemeProvider';
import { Focus, Minus, Plus } from 'lucide-react';
import SpriteText from 'three-spritetext';
import * as THREE from 'three';

type DependencyUniverseProps = {
    readonly pkg: PackageManifest;
};

type GraphNode = NodeObject & {
    id: string;
    group: 'root' | 'prod' | 'dev' | 'peer';
    val: number;
};

type GraphLink = {
    source: string | GraphNode;
    target: string | GraphNode;
};

export const DependencyUniverse: React.FC<DependencyUniverseProps> = ({pkg}) => {
    const navigate = useNavigate();
    const {theme} = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphRef = useRef<any>(undefined);
    const [dimensions, setDimensions] = useState({width: 0, height: 0});
    const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);

    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: 600,
                });
            }
        };

        updateDimensions();
        const observer = new ResizeObserver(updateDimensions);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const graphData = useMemo<GraphData<GraphNode, GraphLink>>(() => {
        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];

        const rootNode: GraphNode = {
            id: pkg.name,
            group: 'root',
            val: 20,
        };
        nodes.push(rootNode);

        const addDeps = (deps: Record<string, string> | undefined, group: 'prod' | 'dev' | 'peer') => {
            if (!deps) return;
            Object.keys(deps).forEach((depName) => {
                const node: GraphNode = {
                    id: depName,
                    group,
                    val: 10,
                };
                nodes.push(node);

                const link: GraphLink = {source: pkg.name, target: depName};
                links.push(link);
            });
        };

        addDeps(pkg.dependencies, 'prod');
        addDeps(pkg.devDependencies, 'dev');
        addDeps(pkg.peerDependencies, 'peer');

        return {nodes, links};
    }, [pkg]);

    useEffect(() => {
        if (graphRef.current) {
            // Tweak forces for closer layout
            graphRef.current.d3Force('charge')?.strength(-120);
            graphRef.current.d3Force('link')?.distance(50);
        }
    }, [graphData]);

    // Custom Node Rendering (3D Objects)
    const nodeThreeObject = useCallback((node: GraphNode) => {
        const isRoot = node.id === pkg.name;

        // Colors based on theme
        const colors = isDark ? {
            root: '#ef4444', // red-500
            prod: '#3b82f6', // blue-500
            dev: '#22c5e0',  // cyan-500
            peer: '#eab308', // yellow-500
        } : {
            root: '#dc2626', // red-600
            prod: '#2563eb', // blue-600
            dev: '#0891b2',  // cyan-600
            peer: '#ca8a04', // yellow-600
        };

        let color = colors.prod;
        if (node.group === 'root') {
            color = colors.root;
        }
        if (node.group === 'dev') {
            color = colors.dev;
        }
        if (node.group === 'peer') {
            color = colors.peer;
        }

        // Create Sphere
        const geometry = new THREE.SphereGeometry(isRoot ? 6 : 4);
        const material = new THREE.MeshLambertMaterial({
            color: color,
            transparent: true,
            opacity: 0.9,
        });
        const sphere = new THREE.Mesh(geometry, material);

        // Add Label sprite
        const sprite = new SpriteText(node.id);
        sprite.color = isDark ? '#ffffff' : '#171717';
        sprite.textHeight = isRoot ? 4 : 2;
        sprite.position.y = isRoot ? 10 : 6;
        sphere.add(sprite);

        return sphere;
    }, [pkg.name, isDark]);

    const handleNodeClick = (node: GraphNode): void => {
        if (node.id === pkg.name) {
            return;
        }
        void navigate({to: '/package/$name', params: {name: node.id}});
    };

    const handleZoomIn = () => {
        const currentPos = graphRef.current?.cameraPosition();
        if (currentPos) {
            graphRef.current?.cameraPosition(
                {x: currentPos.x * 0.8, y: currentPos.y * 0.8, z: currentPos.z * 0.8},
                currentPos,
                400,
            );
        }
    };

    const handleZoomOut = (): void => {
        const currentPos = graphRef.current?.cameraPosition();
        if (currentPos) {
            graphRef.current?.cameraPosition(
                {x: currentPos.x * 1.2, y: currentPos.y * 1.2, z: currentPos.z * 1.2},
                currentPos,
                400,
            );
        }
    };

    const handleFitView = (): void => {
        graphRef.current?.zoomToFit(400);
    };

    return (
        <div
            ref={containerRef}
            className={'relative h-[600px] w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950'}
        >
            <div className={'absolute left-4 top-4 z-10 flex gap-4 rounded-lg border border-neutral-200 bg-white/80 p-2 text-xs font-medium text-neutral-600 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-400'}>
                <div className={'flex items-center gap-1.5'}>
                    <span className={'h-2.5 w-2.5 rounded-full border-2 border-red-500 bg-white dark:bg-black'}/>
                    <span>Target</span>
                </div>
                {pkg.dependencies && (
                    <div className={'flex items-center gap-1.5'}>
                        <span className={'h-2.5 w-2.5 rounded-full border-2 border-blue-500 bg-white dark:bg-black'}/>
                        <span>Prod</span>
                    </div>
                )}
                {pkg.devDependencies && (
                    <div className={'flex items-center gap-1.5'}>
                        <span className={'h-2.5 w-2.5 rounded-full border-2 border-cyan-500 bg-white dark:bg-black'}/>
                        <span>Dev</span>
                    </div>
                )}
                {pkg.peerDependencies && (
                    <div className={'flex items-center gap-1.5'}>
                        <span className={'h-2.5 w-2.5 rounded-full border-2 border-yellow-500 bg-white dark:bg-black'}/>
                        <span>Peer</span>
                    </div>
                )}
            </div>

            <div className={'absolute bottom-4 right-4 z-10 flex flex-col gap-2'}>
                <button
                    onClick={handleZoomIn}
                    className={'flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'}
                    aria-label={'Zoom In'}
                >
                    <Plus className={'h-4 w-4'}/>
                </button>
                <button
                    onClick={handleZoomOut}
                    className={'flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'}
                    aria-label={'Zoom Out'}
                >
                    <Minus className={'h-4 w-4'}/>
                </button>
                <button
                    onClick={handleFitView}
                    className={'flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'}
                    aria-label={'Fit View'}
                >
                    <Focus className={'h-4 w-4'}/>
                </button>
            </div>

            {dimensions.width > 0 && (
                <ForceGraph3D
                    ref={graphRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={graphData}
                    nodeThreeObject={nodeThreeObject}
                    nodeLabel={''}
                    backgroundColor={'rgba(0,0,0,0)'}
                    linkColor={() => isDark ? '#404040' : '#e5e5e5'}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    linkWidth={(link: any) => (hoverNode && (link.source === hoverNode || link.target === hoverNode)) ? 2 : 1}
                    onNodeHover={(node) => {
                        setHoverNode(node as GraphNode || null);
                        containerRef.current!.style.cursor = node ? 'pointer' : 'default';
                    }}
                    onNodeClick={(node) => handleNodeClick(node as GraphNode)}
                    cooldownTicks={100}
                />
            )}
        </div>
    );
};

export default DependencyUniverse;
