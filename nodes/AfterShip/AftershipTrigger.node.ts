import type {
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import { createHmac } from 'crypto';

export class AftershipTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AfterShip Trigger',
		name: 'aftershipTrigger',
		icon: 'file:aftership.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handle Aftership events via webhooks',
		defaults: {
			name: 'AfterShip Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'aftershipApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const headerData = this.getHeaderData();
		const credentials = await this.getCredentials('aftershipApi');
		const secret = credentials.webhook_secret as string;
		if (headerData['Aftership-Hmac-Sha256'] === undefined) {
			console.log(`Aftership-Hmac-Sha256 not found`);
			return {};
		}

		const computedSignature = createHmac('sha256', secret).update(req.rawBody).digest('base64');

		if (headerData['Aftership-Hmac-Sha256'] !== computedSignature) {
			// Signature is not valid so ignore call
			return {
				workflowData: [this.helpers.returnJsonArray({error: "Signature is not valid so ignore call"} as IDataObject)],
			};
		}
		return {
			workflowData: [this.helpers.returnJsonArray(req.body as IDataObject)],
		};
	}
}
