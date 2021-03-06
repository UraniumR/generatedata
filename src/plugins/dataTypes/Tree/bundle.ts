import { DTDefinition } from '../../../../types/dataTypes';
export { generate, getMetadata } from './Tree.generate';

const definition: DTDefinition = {
	name: 'Tree',
	fieldGroup: 'other',
	fieldGroupOrder: 30,
	processOrder: 2,
	localeFiles: [
		'de', 'en', 'es', 'fr', 'nl'
	],
	exports: [
		'rowStateReducer', 'getMetadata'
	],
	schema: {
		title: 'Tree',
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			autoIncRowNum: {
				type: 'integer'
			},
			maxSiblings: {
				type: 'integer',
				minimum: 1
			}
		},
		required: [
			'autoIncRowNum',
			'maxSiblings'
		]
	}
};

export default definition;
