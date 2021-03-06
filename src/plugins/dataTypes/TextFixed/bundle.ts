import { DTDefinition } from '../../../../types/dataTypes';

export{ generate, getMetadata } from './TextFixed.generate';

const definition: DTDefinition = {
	name: 'Fixed Number of Words',
	fieldGroup: 'text',
	fieldGroupOrder: 10,
	localeFiles: [
		'de', 'en', 'es', 'fr', 'nl'
	],
	exports: [
		'rowStateReducer', 'getMetadata'
	],
	schema: {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			numWords: {
				type: 'integer',
				minimum: 1
			}
		},
		required: [
			'numWords'
		]
	}
};

export default definition;
