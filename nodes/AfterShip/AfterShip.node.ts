import type {
	INodeType,
	IExecuteFunctions,
	INodeTypeDescription,
	INodeExecutionData,
} from 'n8n-workflow';


export class AfterShip implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'AfterShip',
		name: 'aftership',
		icon: 'file:aftership.svg',
		group: ['output'],
		version: 1,
		description: 'Consume AfterShip API',
		defaults: {
			name: 'AfterShip API Consumer',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return this.prepareOutputData([]);
	}
}
