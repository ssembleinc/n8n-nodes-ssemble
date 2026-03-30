const requestOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['request'],
			},
		},
		options: [
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Check the processing status and progress of a short creation request',
				action: 'Get request status',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'List many short creation requests with optional filtering and pagination',
				action: 'Get many requests',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Permanently delete a request and all generated videos. Credits are NOT refunded.',
				action: 'Delete a request',
			},
		],
		default: 'getStatus',
	},
];

const requestFields = [
	// ── Get Status: Request ID ──
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['request'],
				operation: ['getStatus'],
			},
		},
		description: 'The request ID to check status for',
	},
	// ── Get Many: Filters ──
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
				resource: ['request'],
				operation: ['getAll'],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['request'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Cancelled', value: 'cancelled' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Failed', value: 'failed' },
					{ name: 'Processing', value: 'processing' },
					{ name: 'Queued', value: 'queued' },
				],
				default: '',
				description: 'Filter by processing status',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{ name: 'Created At', value: 'createdAt' },
					{ name: 'Updated At', value: 'updatedAt' },
				],
				default: 'createdAt',
				description: 'Field to sort results by',
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				options: [
					{ name: 'Descending', value: 'desc' },
					{ name: 'Ascending', value: 'asc' },
				],
				default: 'desc',
				description: 'Sort direction',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Page number for pagination',
			},
		],
	},
	// ── Delete: Request ID ──
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['request'],
				operation: ['delete'],
			},
		},
		description: 'The request ID to delete. This action is irreversible and credits are NOT refunded.',
	},
];

module.exports = { requestOperations, requestFields };
