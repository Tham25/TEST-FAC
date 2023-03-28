import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fieldAssyHistory } from '~/config/assyHistory';
import { getAssyHistoryRedux, getAssyTemplateRedux } from '~/redux/slices/circuitAssy';
import { fDate } from '~/utils/formatTime';

const formatData = (mappingHistory, assyTemplate) => {
  const rows = [];
  const columns = [];
  if (mappingHistory.length) {
    assyTemplate.forEach((e, index) => {
      const item = mappingHistory.find((element) => element.name === e.name);

      const { assy } = item;
      assy.forEach((assyItem, idAssy) => {
        const { steps } = assyItem;

        steps.forEach((step, idStep) => {
          rows.push({
            id: `${index}-${idAssy}-${idStep}`,
            'Assy Name': item.name,
            'Assy Id': assyItem.id_assy,
            'Step Name': step.name,
            Status: step.status ? 'OK' : 'NG',
            'Num of reworks': step.rework_count,
            Reason: step.NG_reason,
            Strategy: step.NG_solution,
            Time: fDate(assyItem.updated_at),
            Author: step.test_user,
            Account: assyItem.created_user.username || assyItem.created_user.email,
          });
        });
      });
    });

    Object.keys(rows[0]).forEach((key) => {
      if (key !== 'id') {
        const columnInfo = {
          field: key,
          flex: key !== 'Assy Name' && key !== 'Assy Id' && key !== 'Step Name',
          sortable: false,
          headerAlign: 'center',
          align: key !== 'Step Name' && 'center',
        };

        switch (key) {
          case 'Assy Name' || 'Assy Id':
            columnInfo.width = 140;
            break;
          case 'Step Name':
            columnInfo.width = 200;
            break;
          case 'Status':
            columnInfo.width = 80;
            break;
          default:
            break;
        }

        columns.push(columnInfo);
      }
    });
  }

  return { rows, columns };
};

function AssyHistory({ serialNumber }) {
  const dispatch = useDispatch();
  const { mappingHistory, assyTemplate, isLoading } = useSelector((state) => state.circuitAssy);

  useEffect(() => {
    dispatch(getAssyHistoryRedux(fieldAssyHistory.serialNumber, serialNumber));
    dispatch(getAssyTemplateRedux());
  }, [dispatch, serialNumber]);

  const { rows, columns } = useMemo(() => {
    return formatData(mappingHistory, assyTemplate);
  }, [mappingHistory, assyTemplate]);

  return (
    <DataGridPremium
      hideFooter
      disableColumnMenu
      rows={rows}
      columns={columns}
      rowGroupingColumnMode="multiple"
      initialState={{
        rowGrouping: {
          model: ['Assy Name', 'Assy Id'],
        },
        columns: {
          columnVisibilityModel: { 'Assy Name': false, 'Assy Id': false },
        },
      }}
      groupingColDef={{
        hideDescendantCount: true,
      }}
      rowHeight={36}
      loading={isLoading}
    />
  );
}

export default AssyHistory;
