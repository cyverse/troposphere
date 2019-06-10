export const compareRoot = sortBy => (a, b) => {
    return (a.get(sortBy) + "").localeCompare(b.get(sortBy));
};

export const compareRootReverse = sortBy => (a, b) => {
    return (b.get(sortBy) + "").localeCompare(a.get(sortBy));
};

export const compareChild = child => sortBy => (a, b) => {
    return a.get(sortBy)[child].localeCompare(b.get(sortBy)[child]);
};

export const compareWithMethod = method => (a, b) => {
    return method(a).localeCompare(method(b));
};

export const compareWithMethodReverse = method => (a, b) => {
    return method(b).localeCompare(method(a));
};
