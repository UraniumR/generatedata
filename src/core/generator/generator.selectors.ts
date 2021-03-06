import { createSelector } from 'reselect';
import { getGenerationOptionsByDataType } from '../../utils/dataTypeGenerationUtils';
import { processOrders } from '../../utils/dataTypeUtils';
import { GenerationTemplate } from '../../../types/general';
import { BuilderLayout } from '../../components/builder/Builder.component';
import { DataRow } from './generator.reducer';
import { DataTypeFolder } from '../../_plugins';

export const getExportType = (state: any): any => state.generator.exportType;
export const getRows = (state: any): any => state.generator.rows;
export const getSortedRows = (state: any): any[] => state.generator.sortedRows;
export const isGridVisible = (state: any): boolean => state.generator.showGrid;
export const isPreviewVisible = (state: any): boolean => state.generator.showPreview;
export const getBuilderLayout = (state: any): BuilderLayout => state.generator.builderLayout;
export const getNumPreviewRows = (state: any): number => state.generator.numPreviewRows;
export const shouldShowRowNumbers = (state: any): boolean => state.generator.showRowNumbers;
export const shouldEnableLineWrapping = (state: any): boolean => state.generator.enableLineWrapping;
export const getTheme = (state: any): string => state.generator.theme;
export const getPreviewTextSize = (state: any): number => state.generator.previewTextSize;
export const getGeneratedPreviewData = (state: any): any => state.generator.generatedPreviewData;
export const shouldShowExportSettings = (state: any): any => state.generator.showExportSettings;
export const getPreviewPanelDimensions = (state: any): any => state.generator.previewPanelDimensions;
export const getExportSettingsTab = (state: any): any => state.generator.exportSettingsTab;

export const getNumRows = createSelector(
	getSortedRows,
	(rows) => rows.length
);

export const getSortedRowsArray = createSelector(
	getRows,
	getSortedRows,
	(rows, sorted) => sorted.map((id: string) => ({ ...rows[id], id }))
);

export const getNonEmptySortedRows = createSelector(
	getSortedRowsArray,
	(rows) => rows.filter((row: DataRow) => row.dataType !== null && row.dataType.trim() !== '')
);

export const getColumnTitles = createSelector(
	getSortedRowsArray,
	(rows) => rows.filter((row: any) => row.dataType !== null && row.title !== '').map((row: any) => row.title)
);

export const getPreviewData = createSelector(
	getNumPreviewRows,
	getNonEmptySortedRows,
	getGeneratedPreviewData,
	(numPreviewRows, rows, data) => {
		const numRows = rows.length;
		const formattedData: any[] = [];

		for (let j=0; j<numPreviewRows; j++) {
			const rowData = [];
			for (let i=0; i<numRows; i++) {
				const id = rows[i].id;
				// this occurs when a new row is first added. The data is generated AFTERWARDS (see logic in onSelectDataType() action)
				if (!data[id]) {
					continue;
				}
				rowData.push(data[id][j]);
			}

			if (rowData.length) {
				formattedData.push(rowData);
			}
		}

		return formattedData;
	}
);

type ProcessOrders = {
	[num: number]: any;
};

export const getGenerationTemplate = createSelector(
	getNonEmptySortedRows,
	(rows): GenerationTemplate => {

		const templateByProcessOrder: ProcessOrders = {};
		rows.map(({ id, title, dataType, data }: any, colIndex: number) => {
			const processOrder = processOrders[dataType as DataTypeFolder];

			// TODO another assumption here. We need to validate the whole component right-up front during the
			// build step and throw a nice error saying what's missing
			const { generate, getMetadata, rowStateReducer } = getGenerationOptionsByDataType(dataType);

			// @ts-ignore
			if (!templateByProcessOrder[processOrder]) {
				// @ts-ignore
				templateByProcessOrder[processOrder] = [];
			}

			// @ts-ignore
			templateByProcessOrder[processOrder].push({
				id,
				title,
				dataType,
				colIndex,

				// settings for the DT cell. The rowStateReducer is optional: it lets developers convert the Data Type row
				// state into something friendlier for the generation step
				rowState: rowStateReducer ? rowStateReducer(data) : data,

				// DT methods for the actual generation of this cell
				generateFunc: generate,
				colMetadata: getMetadata ? getMetadata() : null
			});
		});

		// TODO sort by process order (keys) here

		return templateByProcessOrder;
	}
);

export const getPreviewPanelData = createSelector(
	getColumnTitles,
	getPreviewData,
	(columnTitles, rows) => ({
		isFirstBatch: true,
		isLastBatch: true,
		columnTitles,
		rows
	})
);
