import { DTDefinition } from '../../../../types/dataTypes';

export { Help, Options } from './Region.ui';
export { generate } from './Region.generate';

const definition: DTDefinition = {
	name: 'Region',
	fieldGroup: 'geo',
	fieldGroupOrder: 40,
	processOrder: 2,
	localeFiles: [
		'de', 'en', 'es', 'fr', 'nl'
	],
	exports: [
		'Options', 'Help'
	],
	schema: {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			countries: {
				type: 'object'
			}
		}
	}
};

export default definition;
