var moment = require('moment')

const timeLabel = (raw) => {
	var timeNow = new Date()
	var updatedAt = new Date(raw)
	var diffHour = Math.abs((timeNow.getTime() - updatedAt.getTime()) / 1000 / 60 / 60 )

	if (diffHour < 1) {
		return `${parseInt(diffHour * 60, 10)}分钟前`
	} else if (diffHour < 24) {
		return `${parseInt(diffHour, 10)}小时前`
	} else if (diffHour >= 24 && diffHour < 168) {
		return `${parseInt(diffHour / 24, 10)}天前`
	} else {
		return moment(updatedAt).format("YYYY-MM-DD");
	}
}

export default timeLabel