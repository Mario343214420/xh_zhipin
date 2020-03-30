export function getRedirectPath(type, header) {
	let path = ''
	path += type === 0 ? 0 : 1
	if (!header) {
		path += 'info'
	}
	return path
}
