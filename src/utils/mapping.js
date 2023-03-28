export function validateFormMap(form) {
  let error = false;
  const errorFormMap = {};

  form.forEach((item) => {
    const assyId = item.assy_id.trim();
    if (!assyId) {
      error = true;
      errorFormMap[item.assy_name] = { mess: 'This field is required!', severity: 'error' };
    } else {
      const array = form.filter((element) => element.assy_id === assyId);
      if (array.length > 1) {
        error = true;
        errorFormMap[item.assy_name] = { mess: 'This Assy ID is duplicated!', severity: 'error' };
      }
    }
  });

  return { error, errorFormMap };
}

export function checkAssyId(assyIdsCheck, formMapping, serialNumber) {
  const errorFormMap = {};
  let error = false;
  assyIdsCheck.forEach((item) => {
    const assyId = Object.keys(item)[0];
    const info = item[assyId];

    const result = formMapping.find((element) => element.assy_id === assyId);

    if (result) {
      if (info.existed && info.name !== result.assy_name) {
        errorFormMap[result.assy_name] = {
          mess: `Assy Id is existed in ${info.name}!`,
          severity: 'error',
        };
        error = true;
      } else if (!info.existed) {
        error = true;
        errorFormMap[result.assy_name] = { mess: "Assy Id ins't existed!", severity: 'error' };
      }

      if (info.serial_number && info.serial_number !== serialNumber) {
        errorFormMap[result.assy_name] = {
          mess: `This assy is existed in device ${info.serial_number}!`,
          severity: 'warning',
        };
      }
    }
  });

  return { error, errorFormMap };
}
