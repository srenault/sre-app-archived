export function grouped(array, n) {
  return array.reduce((acc, el) => {
    const [headGroup, ...tailGroups] = acc;
    if (headGroup && headGroup.length < n) {
      const updatedHeadGroup = (headGroup || []).concat(el);
      return [updatedHeadGroup, ...tailGroups];
    } else {
      return [[el]].concat(acc);
    }
  }, []).reverse();
}

export default {
  grouped,
};
