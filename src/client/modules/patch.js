export function generatePatch(patchSpec, oldItem, newItem) {
  // Health warning: this isn't a fully RFC-compliant patch generation tool.
  // It was written on an ad-hoc basis for the purposes of this project :)
  return patchSpec.reduce((last, spec) => {
    if (typeof spec === 'string') {
      const key = spec;
      if (oldItem[key] !== newItem[key]) {
        return [...last, { op: 'replace', path: `/${key}`, value: newItem[key] }];
      }

      return last;
    }

    const { key, type } = spec;

    if (type === 'array') {
      if (spec.length) {
        return oldItem[key].reduce((red, value, index) => {
          if (newItem[key][index] === oldItem[key][index]) {
            return red;
          }

          return [...red, { op: 'replace', path: `/${key}/${index}`, value: newItem[key][index] }];
        }, last);
      }

      if (oldItem[key].length === newItem[key].length
        && oldItem[key].every((value, index) => value === newItem[key][index])) {
        return last;
      }

      return [...last, { op: 'replace', path: `/${key}`, value: newItem[key] }];
    }

    throw new Error(`Unknown spec type ${type}`);
  }, []);
}
