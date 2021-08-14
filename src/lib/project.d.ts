import { DiffColor, MapType, ResourceType } from 'src/lib/const';

type UUID = string;

export interface ProjectMeta {
	name: string;
	songName: string;
	songNameRomanized: string;
	artist: string;
	artistRomanized: string;
	uuids: {
		[key: string]: ResourceType
	};
	resources: {
		[ResourceType.OTHER]: OtherResource[];
		[ResourceType.META]: OtherResource;
		[ResourceType.MAP]: MapResource[];
		[ResourceType.AUDIO]: OtherResource[];
		[ResourceType.IMAGE]: OtherResource[];
		[ResourceType.VIDEO]: OtherResource[];
		[ResourceType.SCRIPT]: OtherResource[]
	}
}

export type Resource = MapResource | OtherResource;

interface R {
	id: UUID;
	name: string;
	type: ResourceType;
}


export interface MapResource extends R {
	type: ResourceType.MAP;
	mapType: MapType;
	color: DiffColor;
	difficulty: string;
	level: number;
	music: UUID;
	bg: UUID;
	offset: number;
	scripts: UUID[];
}

export interface OtherResource extends R {
	type: ResourceType.META | ResourceType.AUDIO | ResourceType.IMAGE | ResourceType.VIDEO | ResourceType.SCRIPT;
}

export interface MapFile {
	timelines: [
		{
			id: UUID,
			name: string,
			bnb: 4
		}
	],
	bpms: [
		{
			id: UUID,
			timeline: UUID,
			beat: Array<number>,
			bpm: 120
		}
	],
	notes: [
		{
			id: '6b3d281a-fd4a-4045-8780-faf460b48abb',
			timeline: 'dd3db744-e5a8-4dfb-be0b-d1676dfc51ee',
			type: 0, // 0: tap, 1: flick
			beat: Array<number>,
			lane: number,
			width: number
		},
		{
			id: 'ce7f116f-b982-41d8-b2ab-25664420bae5',
			timeline: 'dd3db744-e5a8-4dfb-be0b-d1676dfc51ee',
			type: 1,
			beat: [
				2,
				0,
				1
			],
			lane: 0,
			width: 12,
			direction: 0, // 0: up, 1: left, 2: right,
			critical: true
		}
	],
	slides: [
		{
			id: '30f079d7-1413-4a6f-aa38-69d2e2a6700e',
			timeline: 'dd3db744-e5a8-4dfb-be0b-d1676dfc51ee',
			critical: true,
			notes: [
				{
					id: '4853a8c1-94f3-42f5-a60c-eaddd20701d2',
					type: 0, // 0: start, 1: invisible, 2: visible, 3: end-tap, 4: end-flick
					beat: [
						3,
						0,
						1
					],
					lane: 0,
					width: 3,
					curve: 'ease-out' // linear, ease-in, ease-out, ease-in-out, cubic-bezier(x1, y1, x2, y2)
				},
				{
					id: '8d78494d-f947-4779-b939-8a0a4be198a0',
					type: 1, // 0: start, 1: invisible, 2: visible, 3: end-tap, 4: end-flick
					beat: [
						4,
						0,
						1
					],
					lane: 0,
					width: 3,
					curve: 'ease-in'
				},
				{
					id: '4e3670f0-890a-4b6c-8f9d-8b6b8f320d48',
					type: 4, // 0: start, 1: invisible, 2: visible, 3: end-tap, 4: end-flick
					beat: [
						5,
						0,
						1
					],
					lane: 0,
					width: 3,
					direction: 2 // 0: up, 1: left, 2: right,
				}
			]
		}
	]
}

