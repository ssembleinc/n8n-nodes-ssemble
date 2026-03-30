let NodeOperationError;
try {
	({ NodeOperationError } = require('n8n-workflow'));
} catch {
	// n8n-workflow is provided at runtime by n8n
}
const { shortOperations, shortFields } = require('./ShortDescription');
const { requestOperations, requestFields } = require('./RequestDescription');
const { assetOperations, assetFields } = require('./AssetDescription');

const BASE_URL = 'https://aiclipping.ssemble.com/api/v1';

const ASSET_TYPE_TO_PATH = {
	templates: '/templates',
	music: '/music',
	gameVideos: '/game-videos',
	memeHooks: '/meme-hooks',
};

async function apiRequest(context, method, path, credentials, body, qs) {
	const options = {
		method,
		url: `${BASE_URL}${path}`,
		headers: {
			'X-API-Key': credentials.apiKey,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (body) {
		options.body = body;
	}

	if (qs && Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	return context.helpers.httpRequest(options);
}

async function createShort(context, itemIndex, credentials) {
	const videoSource = context.getNodeParameter('videoSource', itemIndex);
	const body = {
		start: context.getNodeParameter('start', itemIndex),
		end: context.getNodeParameter('end', itemIndex),
	};

	if (videoSource === 'url') {
		body.url = context.getNodeParameter('url', itemIndex);
	} else {
		body.fileUrl = context.getNodeParameter('fileUrl', itemIndex);
	}

	const additionalOptions = context.getNodeParameter('additionalOptions', itemIndex, {});

	const optionKeys = [
		'preferredLength',
		'language',
		'captionLanguage',
		'templateId',
		'layout',
		'noClipping',
		'hookTitle',
		'memeHook',
		'memeHookName',
		'gameVideo',
		'gameVideoName',
		'ctaEnabled',
		'ctaText',
		'music',
		'musicName',
		'musicVolume',
		'webhookUrl',
	];

	for (const key of optionKeys) {
		if (additionalOptions[key] !== undefined && additionalOptions[key] !== '') {
			body[key] = additionalOptions[key];
		}
	}

	return apiRequest(context, 'POST', '/shorts/create', credentials, body);
}

async function listRequests(context, itemIndex, credentials) {
	const limit = context.getNodeParameter('limit', itemIndex, 20);
	const filters = context.getNodeParameter('filters', itemIndex, {});

	const qs = { limit };
	if (filters.status) qs.status = filters.status;
	if (filters.sortBy) qs.sortBy = filters.sortBy;
	if (filters.sortOrder) qs.sortOrder = filters.sortOrder;
	if (filters.page) qs.page = filters.page;

	return apiRequest(context, 'GET', '/shorts', credentials, undefined, qs);
}

async function listAssets(context, itemIndex, credentials) {
	const assetType = context.getNodeParameter('assetType', itemIndex);
	const path = ASSET_TYPE_TO_PATH[assetType];
	const qs = {};

	if (assetType !== 'templates') {
		qs.limit = context.getNodeParameter('limit', itemIndex, 20);
		qs.page = context.getNodeParameter('page', itemIndex, 1);
	}

	return apiRequest(context, 'GET', path, credentials, undefined, qs);
}

class Ssemble {
	constructor() {
		this.description = {
			displayName: 'Ssemble',
			name: 'ssemble',
			icon: 'file:ssemble.svg',
			group: ['transform'],
			version: 1,
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description:
				'Create AI-generated short-form video clips from YouTube with captions, music, gameplay overlays, and viral scoring.',
			defaults: {
				name: 'Ssemble',
			},
			usableAsTool: true,
			inputs: ['main'],
			outputs: ['main'],
			credentials: [
				{
					name: 'ssembleApi',
					required: true,
				},
			],
			properties: [
				{
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					noDataExpression: true,
					options: [
						{
							name: 'Short',
							value: 'short',
						},
						{
							name: 'Request',
							value: 'request',
						},
						{
							name: 'Asset',
							value: 'asset',
						},
					],
					default: 'short',
				},
				...shortOperations,
				...shortFields,
				...requestOperations,
				...requestFields,
				...assetOperations,
				...assetFields,
			],
		};
	}

	async execute() {
		const items = this.getInputData();
		const returnData = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i);
				const operation = this.getNodeParameter('operation', i);
				const credentials = await this.getCredentials('ssembleApi');

				let response;

				if (resource === 'short') {
					if (operation === 'create') {
						response = await createShort(this, i, credentials);
					} else if (operation === 'getResults') {
						const requestId = this.getNodeParameter('requestId', i);
						response = await apiRequest(this, 'GET', `/shorts/${requestId}`, credentials);
					}
				} else if (resource === 'request') {
					if (operation === 'getStatus') {
						const requestId = this.getNodeParameter('requestId', i);
						response = await apiRequest(
							this,
							'GET',
							`/shorts/${requestId}/status`,
							credentials,
						);
					} else if (operation === 'getAll') {
						response = await listRequests(this, i, credentials);
					} else if (operation === 'delete') {
						const requestId = this.getNodeParameter('requestId', i);
						response = await apiRequest(
							this,
							'DELETE',
							`/shorts/${requestId}`,
							credentials,
						);
					}
				} else if (resource === 'asset') {
					response = await listAssets(this, i, credentials);
				}

				if (Array.isArray(response)) {
					returnData.push(...response.map((item) => ({ json: item, pairedItem: i })));
				} else {
					returnData.push({ json: response || {}, pairedItem: i });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: i });
				} else {
					throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
				}
			}
		}

		return [returnData];
	}
}

module.exports = { Ssemble };
