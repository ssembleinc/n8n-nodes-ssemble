const assetOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['asset'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List available assets (caption templates, music tracks, gameplay overlays, or meme hooks)',
				action: 'List assets',
			},
		],
		default: 'list',
	},
];

const assetFields = [
	{
		displayName: 'Asset Type',
		name: 'assetType',
		type: 'options',
		options: [
			{
				name: 'Caption Templates',
				value: 'templates',
				description: 'Caption style templates (Karaoke, Bold, Minimal, etc.). Use the templateId when creating shorts.',
			},
			{
				name: 'Music Tracks',
				value: 'music',
				description: 'Background music tracks. Use the exact musicName when creating shorts.',
			},
			{
				name: 'Game Videos',
				value: 'gameVideos',
				description: 'Gameplay overlay videos for split-screen shorts (Minecraft, GTA, etc.). Use the exact gameVideoName when creating shorts.',
			},
			{
				name: 'Meme Hooks',
				value: 'memeHooks',
				description: 'Short 2-5 second attention-grabbing clips prepended to shorts. Use the exact memeHookName when creating shorts.',
			},
		],
		default: 'templates',
		required: true,
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['list'],
			},
		},
		description: 'The type of asset to list',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['list'],
				assetType: ['music', 'gameVideos', 'memeHooks'],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['asset'],
				operation: ['list'],
				assetType: ['music', 'gameVideos', 'memeHooks'],
			},
		},
		description: 'Page number for pagination',
	},
];

module.exports = { assetOperations, assetFields };
