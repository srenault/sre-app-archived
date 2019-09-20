export function grouped(array, n) {
  return array.slice().reduce((acc, el) => {
    const [headGroup, ...tailGroups] = acc;
    if (headGroup && headGroup.length < n) {
      const updatedHeadGroup = (headGroup || []).concat(el);
      return [updatedHeadGroup, ...tailGroups];
    } else {
      return [[el]].concat(acc);
    }
  }, []).map((group) => group.reverse()).reverse();
}

export default {
  grouped,
};
