const shortOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['short'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create AI-generated short-form video clips from a YouTube video or file URL. Returns a request ID instantly. Processing takes 5-30 minutes.',
				action: 'Create a short',
			},
			{
				name: 'Get Results',
				value: 'getResults',
				description: 'Retrieve all generated clips for a completed request, including video URLs, titles, viral scores, and durations',
				action: 'Get short results',
			},
		],
		default: 'create',
	},
];

const shortFields = [
	// ── Create: Video Source ──
	{
		displayName: 'Video Source',
		name: 'videoSource',
		type: 'options',
		options: [
			{
				name: 'YouTube URL',
				value: 'url',
			},
			{
				name: 'File URL',
				value: 'fileUrl',
			},
		],
		default: 'url',
		displayOptions: {
			show: {
				resource: ['short'],
				operation: ['create'],
			},
		},
		description: 'Whether to use a YouTube URL or a publicly accessible file URL',
	},
	{
		displayName: 'YouTube URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['short'],
				operation: ['create'],
				videoSource: ['url'],
			},
		},
		placeholder: 'e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		description: 'The YouTube video URL (YouTube Shorts URLs are not supported)',
	},
	{
		displayName: 'File URL',
		name: 'fileUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['short'],
				operation: ['create'],
				videoSource: ['fileUrl'],
			},
		},
		placeholder: 'e.g. https://example.com/video.mp4',
		description: 'A publicly accessible video file URL (HTTP/HTTPS)',
	},
	// ── Create: Time Range ──
	{
		displayName: 'Start Time (Seconds)',
		name: 'start',
		type: 'number',
		default: 0,
		required: true,
		typeOptions: {
			minValue: 0,
		},
		displayOptions: {
			show: {
				resource: ['short'],
				operation: ['create'],
			},
		},
		description: 'Start time in seconds (>= 0)',
	},
	{
		displayName: 'End Time (Seconds)',
		name: 'end',
		type: 'number',
		default: 600,
		required: true,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['short'],
				operation: ['create'],
			},
		},
		description: 'End time in seconds. Max window is 1200 seconds (20 minutes).',
	},
	// ── Create: Additional Options ──
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['short'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Caption Language',
				name: 'captionLanguage',
				type: 'string',
				default: '',
				description: 'Caption/subtitle language if different from spoken language (ISO 639-1 code)',
			},
			{
				displayName: 'CTA Enabled',
				name: 'ctaEnabled',
				type: 'boolean',
				default: false,
				description: 'Whether to show a call-to-action text overlay',
			},
			{
				displayName: 'CTA Text',
				name: 'ctaText',
				type: 'string',
				default: '',
				description: 'Call-to-action text content (max 200 characters). Required when CTA is enabled.',
			},
			{
				displayName: 'Game Video',
				name: 'gameVideo',
				type: 'boolean',
				default: false,
				description: 'Whether to add a split-screen gameplay overlay (content top, game bottom)',
			},
			{
				displayName: 'Game Video Name',
				name: 'gameVideoName',
				type: 'string',
				default: '',
				description: 'Specific game video name (case-sensitive). Use the "Asset > List" operation to browse games.',
			},
			{
				displayName: 'Hook Title',
				name: 'hookTitle',
				type: 'boolean',
				default: false,
				description: 'Whether to add an animated hook title at the start',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				options: [
					{ name: 'Arabic', value: 'ar' },
					{ name: 'Chinese', value: 'zh' },
					{ name: 'Czech', value: 'cs' },
					{ name: 'Danish', value: 'da' },
					{ name: 'Dutch', value: 'nl' },
					{ name: 'English', value: 'en' },
					{ name: 'Finnish', value: 'fi' },
					{ name: 'French', value: 'fr' },
					{ name: 'German', value: 'de' },
					{ name: 'Hindi', value: 'hi' },
					{ name: 'Italian', value: 'it' },
					{ name: 'Japanese', value: 'ja' },
					{ name: 'Korean', value: 'ko' },
					{ name: 'Norwegian', value: 'no' },
					{ name: 'Polish', value: 'pl' },
					{ name: 'Portuguese', value: 'pt' },
					{ name: 'Russian', value: 'ru' },
					{ name: 'Spanish', value: 'es' },
					{ name: 'Swedish', value: 'sv' },
					{ name: 'Turkish', value: 'tr' },
				],
				default: 'en',
				description: 'Spoken language of the video (ISO 639-1)',
			},
			{
				displayName: 'Layout',
				name: 'layout',
				type: 'options',
				options: [
					{ name: 'Auto', value: 'auto' },
					{ name: 'Fill', value: 'fill' },
					{ name: 'Fit', value: 'fit' },
					{ name: 'Square', value: 'square' },
				],
				default: 'auto',
				description: 'Video framing layout',
			},
			{
				displayName: 'Meme Hook',
				name: 'memeHook',
				type: 'boolean',
				default: false,
				description: 'Whether to prepend a short meme clip (2-5 second attention grabber)',
			},
			{
				displayName: 'Meme Hook Name',
				name: 'memeHookName',
				type: 'string',
				default: '',
				description: 'Specific meme hook name (case-sensitive). Use the "Asset > List" operation to browse hooks.',
			},
			{
				displayName: 'Music',
				name: 'music',
				type: 'boolean',
				default: false,
				description: 'Whether to add background music',
			},
			{
				displayName: 'Music Name',
				name: 'musicName',
				type: 'string',
				default: '',
				description: 'Specific track name (case-sensitive). Use the "Asset > List" operation to browse music.',
			},
			{
				displayName: 'Music Volume',
				name: 'musicVolume',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
				default: 10,
				description: 'Music volume level (0-100)',
			},
			{
				displayName: 'No Clipping',
				name: 'noClipping',
				type: 'boolean',
				default: false,
				description: 'Whether to skip AI clipping and process the entire time range as one clip',
			},
			{
				displayName: 'Preferred Length',
				name: 'preferredLength',
				type: 'options',
				options: [
					{ name: 'Under 10 Min', value: 'under10min' },
					{ name: 'Under 3 Min', value: 'under3min' },
					{ name: 'Under 30 Sec', value: 'under30sec' },
					{ name: 'Under 5 Min', value: 'under5min' },
					{ name: 'Under 60 Sec', value: 'under60sec' },
					{ name: 'Under 90 Sec', value: 'under90sec' },
				],
				default: 'under60sec',
				description: 'Target clip duration',
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				default: '',
				description: 'Caption template ID (24-char hex). Use the "Asset > List" operation to browse templates.',
			},
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				default: '',
				description: 'URL to receive a POST request when processing completes or fails. Use instead of polling for status.',
			},
		],
	},
	// ── Get Results: Request ID ──
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['short'],
				operation: ['getResults'],
			},
		},
		description: 'The request ID returned by the Create operation',
	},
];

module.exports = { shortOperations, shortFields };
