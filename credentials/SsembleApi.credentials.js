class SsembleApi {
	constructor() {
		this.name = 'ssembleApi';
		this.displayName = 'Ssemble API';
		this.documentationUrl = 'https://github.com/ssembleinc/ssemble-mcp-server#get-your-api-key';
		this.properties = [
			{
				displayName: 'API Key',
				name: 'apiKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description:
					'Your Ssemble API key (starts with sk_ssemble_). Get one at https://app.ssemble.com → Settings → API Keys.',
			},
		];
		this.authenticate = {
			type: 'generic',
			properties: {
				headers: {
					'X-API-Key': '={{$credentials.apiKey}}',
				},
			},
		};
		this.test = {
			request: {
				baseURL: 'https://aiclipping.ssemble.com/api/v1',
				url: '/templates',
				method: 'GET',
			},
		};
	}
}

module.exports = { SsembleApi };
