let NodeConnectionType;
let NodeOperationError;
try {
	({ NodeConnectionType, NodeOperationError } = require('n8n-workflow'));
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
						response = await this.createShort(i, credentials);
					} else if (operation === 'getResults') {
						const requestId = this.getNodeParameter('requestId', i);
						response = await this.apiRequest('GET', `/shorts/${requestId}`, credentials);
					}
				} else if (resource === 'request') {
					if (operation === 'getStatus') {
						const requestId = this.getNodeParameter('requestId', i);
						response = await this.apiRequest(
							'GET',
							`/shorts/${requestId}/status`,
							credentials,
						);
					} else if (operation === 'getAll') {
						response = await this.listRequests(i, credentials);
					} else if (operation === 'delete') {
						const requestId = this.getNodeParameter('requestId', i);
						response = await this.apiRequest(
							'DELETE',
							`/shorts/${requestId}`,
							credentials,
						);
					}
				} else if (resource === 'asset') {
					response = await this.listAssets(i, credentials);
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

	async createShort(itemIndex, credentials) {
		const videoSource = this.getNodeParameter('videoSource', itemIndex);
		const body = {
			start: this.getNodeParameter('start', itemIndex),
			end: this.getNodeParameter('end', itemIndex),
		};

		if (videoSource === 'url') {
			body.url = this.getNodeParameter('url', itemIndex);
		} else {
			body.fileUrl = this.getNodeParameter('fileUrl', itemIndex);
		}

		const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {});

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
		];

		for (const key of optionKeys) {
			if (additionalOptions[key] !== undefined && additionalOptions[key] !== '') {
				body[key] = additionalOptions[key];
			}
		}

		return this.apiRequest('POST', '/shorts/create', credentials, body);
	}

	async listRequests(itemIndex, credentials) {
		const limit = this.getNodeParameter('limit', itemIndex, 20);
		const filters = this.getNodeParameter('filters', itemIndex, {});

		const qs = { limit };
		if (filters.status) qs.status = filters.status;
		if (filters.sortBy) qs.sortBy = filters.sortBy;
		if (filters.sortOrder) qs.sortOrder = filters.sortOrder;
		if (filters.page) qs.page = filters.page;

		return this.apiRequest('GET', '/shorts', credentials, undefined, qs);
	}

	async listAssets(itemIndex, credentials) {
		const assetType = this.getNodeParameter('assetType', itemIndex);
		const path = ASSET_TYPE_TO_PATH[assetType];
		const qs = {};

		if (assetType !== 'templates') {
			qs.limit = this.getNodeParameter('limit', itemIndex, 20);
			qs.page = this.getNodeParameter('page', itemIndex, 1);
		}

		return this.apiRequest('GET', path, credentials, undefined, qs);
	}

	async apiRequest(method, path, credentials, body, qs) {
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

		return this.helpers.httpRequest(options);
	}
}

module.exports = { Ssemble };
