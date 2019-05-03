export function removeElementFromArray<T>(array: Array<T>, e: T) {
	array.splice(array.indexOf(e), 1);
	return array;
}